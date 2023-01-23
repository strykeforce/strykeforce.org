{
  description = "Stryke Force Website";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.poetry2nix = {
    url = "github:nix-community/poetry2nix";
    #    url = "github:jhh/poetry2nix/build-systems";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, poetry2nix }:
    let
      version = "4.0.0";
    in
    {
      overlays.default = nixpkgs.lib.composeManyExtensions [
        poetry2nix.overlay
        (final: prev: {
          strykeforce-website-dev = prev.poetry2nix.mkPoetryEnv {
            projectDir = ./.;
            groups = [ "main" "dev" ];
          };

          strykeforce-website = prev.poetry2nix.mkPoetryApplication {
            projectDir = ./.;
            groups = [ "main" ];
            postInstall = ''
              mkdir -p $out/bin/
              cp -vf manage.py $out/bin/
            '';
          };
        })

        (final: prev: {
          strykeforce-static = prev.stdenv.mkDerivation {
            pname = "strykeforce-static";
            inherit version;
            src = ./.;
            phases = "installPhase";
            installPhase = ''
              export DJANGO_SETTINGS_MODULE=website.settings.production
              export SECRET_KEY=
              export TBA_READ_KEY=
              export EMAIL_HOST_USER=
              export EMAIL_HOST_PASSWORD=
              export STATIC_ROOT=$out
              mkdir -p $out
              ${prev.strykeforce-website}/bin/manage.py collectstatic --no-input
            '';
          };
        })

        (final: prev: {
          strykeforce-manage = prev.writeShellScriptBin "strykeforce-manage" ''
            export DJANGO_SETTINGS_MODULE=website.settings.production
            export SECRET_KEY=notsecret
            export TBA_READ_KEY=
            export EMAIL_HOST_USER=
            export EMAIL_HOST_PASSWORD=
            export STATIC_ROOT=${prev.strykeforce-static}
            exec ${prev.strykeforce-website}/bin/manage.py "$@"
          '';
        })
      ];

      nixosModules.strykeforce = { config, lib, pkgs, ... }:
        let
          cfg = config.strykeforce.services.website;
          stateDir = "/var/lib/strykeforce";
        in
        {
          options.strykeforce.services.website = {
            enable = lib.mkEnableOption "Enable the Stryke Force website service";

            ssl = lib.mkOption {
              default = true;
              type = lib.types.bool;
              description = lib.mdDoc ''
                Whether to enable SSL/TLS in Nginx.
              '';
            };

            settingsModule = lib.mkOption {
              type = lib.types.str;
              default = "website.settings.production";
            };

            allowedHosts = lib.mkOption {
              type = lib.types.str;
              default = "strykeforce.org www.strykeforce.org";
            };
          };

          config = lib.mkIf cfg.enable {

            users = {
              users.strykeforce = {
                isSystemUser = true;
                group = "strykeforce";
                extraGroups = [ "redis" ];
              };
              groups.strykeforce = { };
            };

            systemd.tmpfiles.rules = [
              "d ${stateDir} 0775 strykeforce strykeforce -"
            ];

            systemd.services.strykeforce-website =
              let
                website = self.packages.${pkgs.system}.website.dependencyEnv;
                static = self.packages.${pkgs.system}.static;
              in
              {
                wantedBy = [ "multi-user.target" ];
                requires = [ "postgresql.service" ];
                after = [ "postgresql.service" ];

                environment = {
                  DJANGO_SETTINGS_MODULE = cfg.settingsModule;
                  ALLOWED_HOSTS = cfg.allowedHosts;
                  STATIC_ROOT = "${static}";
                  MEDIA_ROOT = "${stateDir}/media";
                };

                preStart = "${website}/bin/manage.py migrate --no-input";

                serviceConfig = {
                  EnvironmentFile = "/run/agenix/stryker_website_secrets";
                  ExecStart = "${website}/bin/gunicorn --bind 127.0.0.1:8000 website.wsgi";
                  User = "strykeforce";
                  Restart = "on-failure";
                };
              };


            services.postgresql = {
              ensureDatabases = [ "strykeforce" ];
              ensureUsers = [
                {
                  name = "strykeforce";
                  ensurePermissions = {
                    "DATABASE strykeforce" = "ALL PRIVILEGES";
                  };
                }
              ];
            };

            systemd.services.postgresql.postStart = ''
              $PSQL -d strykeforce -tA << END_INPUT
                CREATE SCHEMA IF NOT EXISTS strykeforce AUTHORIZATION "strykeforce";
                ALTER ROLE strykeforce SET client_encoding TO 'utf8';
                ALTER ROLE strykeforce SET default_transaction_isolation TO 'read committed';
                ALTER ROLE strykeforce SET timezone TO 'UTC';
              END_INPUT
            '';

            services.redis.servers."" = {
              enable = true;
              save = [ ];
            };
            systemd.services.redis.partOf = [ "strykeforce-website.service" ];

            services.nginx = {
              enable = true;
              recommendedProxySettings = true;
              recommendedOptimisation = true;
              recommendedGzipSettings = true;


              virtualHosts."www.strykeforce.org" = {
                # security.acme is configured for mercury globally
                forceSSL = cfg.ssl;
                enableACME = cfg.ssl;
                serverAliases = [ "strykeforce.org" "mercury.strykeforce.org" ];

                locations = {
                  "/" = {
                    proxyPass = "http://127.0.0.1:8000";
                  };

                  "/media/" = {
                    alias = "${stateDir}/media/";
                    extraConfig = ''
                      expires max;
                      add_header Cache-Control public;
                    '';
                  };
                };
              };
            };

            security.acme.certs = lib.mkIf cfg.ssl {
              "www.strykeforce.org".email = "jeff@j3ff.io";
            };
          };
        };

      nixosModules.default = self.nixosModules.strykeforce;

      nixosConfigurations.container =
        let
          system = "x86_64-linux";
        in
        nixpkgs.lib.nixosSystem {
          inherit system;
          modules = [
            self.nixosModules.default
            ({ ... }: {
              boot.isContainer = true;
              networking.useDHCP = false;
              networking.firewall.enable = false;
              strykeforce.services.website = {
                enable = true;
                settingsModule = "website.settings.test";
              };
              system.stateVersion = "23.05";
            })
          ];
        };

    } //
    (flake-utils.lib.eachDefaultSystem
      (system:
        let
          src = ./.;
          pkgs = import nixpkgs {
            inherit system;
            overlays = [ self.overlays.default ];
          };
        in
        {
          packages = {
            website = pkgs.strykeforce-website;
            static = pkgs.strykeforce-static;
            manage = pkgs.strykeforce-manage;

            # refresh venv for Pycharm with: nix build .#venv -o venv
            venv = pkgs.strykeforce-website-dev;

            default = pkgs.strykeforce-website;
          };

          devShell = pkgs.mkShell
            {
              buildInputs = with pkgs; [
                strykeforce-website-dev
                postgresql
                nodejs
                poetry
                pre-commit
                sqlite
              ] ++ lib.optional stdenv.isDarwin openssl;
            };
        }));
}
