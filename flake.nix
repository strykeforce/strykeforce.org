{
  description = "Behold My Awesome Project!";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.poetry2nix = {
    url = "github:nix-community/poetry2nix";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, poetry2nix }:
    let
      version = "4.0.0-pre";
    in
    {
      overlay = nixpkgs.lib.composeManyExtensions [
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
              export DATABASE_URL=
              export STATIC_ROOT=$out
              mkdir -p $out
              ${prev.strykeforce-website}/bin/manage.py collectstatic --no-input
            '';
          };
        })
      ];

      nixosModules.default = { config, lib, pkgs, ... }:
        let
          cfg = config.strykeforce.services.website;
          stateDir = "/var/lib/strykeforce";
          databaseUrl = "sqlite:///${stateDir}/website.sqlite";
        in
        {
          options.strykeforce.services.website = {
            enable = lib.mkEnableOption "Enable the Stryke Force website service";

            settingsModule = lib.mkOption {
              type = lib.types.str;
              default = "website.settings.production";
            };
          };

          config = lib.mkIf cfg.enable {

            users.users.strykeforce = {
              isSystemUser = true;
              group = "strykeforce";
            };
            users.groups.strykeforce = { };

            systemd.tmpfiles.rules = [
              "d ${stateDir} 0770 strykeforce strykeforce -"
            ];

            systemd.services.strykeforce-website =
              let
                pkg = pkgs.strykeforce-website.dependencyEnv;
              in
              {
                wantedBy = [ "multi-user.target" ];

                environment = {
                  DJANGO_SETTINGS_MODULE = cfg.settingsModule;
                  STATIC_ROOT = "${pkgs.strykeforce-static}";
                  MEDIA_ROOT = "${stateDir}/media";
                  DATABASE_URL = databaseUrl;
                };

                preStart = "${pkg}/bin/manage.py migrate --no-input";

                serviceConfig = {
                  ExecStart = "${pkg}/bin/gunicorn --bind 127.0.0.1:8000 website.wsgi";
                  User = "strykeforce";
                  Restart = "on-failure";
                };
              };

            services.nginx = {
              enable = true;
              recommendedProxySettings = true;
              recommendedOptimisation = true;
              recommendedGzipSettings = true;

              virtualHosts."strykeforce.j3ff.io" = {
                # security.acme is configured for eris globally in nginx.nix
                forceSSL = false;
                enableACME = false;
                acmeRoot = null;

                locations = {
                  "/" = {
                    proxyPass = "http://127.0.0.1:8000";
                  };
                };
              };
            };
          };
        };

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
            overlays = [ self.overlay ];
          };
        in
        {
          packages = {
            default = pkgs.strykeforce-website;
            static = pkgs.strykeforce-static;

            # refresh venv for Pycharm with: nix build .#venv -o venv
            venv = pkgs.strykeforce-website-dev;

          };





          devShell = pkgs.mkShell
            {
              buildInputs = with pkgs; [
                strykeforce-website-dev
                postgresql
                nodejs
                poetry
                pre-commit
              ] ++ lib.optional stdenv.isDarwin openssl;
            };
        }));
}
