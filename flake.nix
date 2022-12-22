{
  description = "Behold My Awesome Project!";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.poetry2nix = {
    url = "github:nix-community/poetry2nix";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, poetry2nix }:
    {
      overlay = nixpkgs.lib.composeManyExtensions [
        poetry2nix.overlay
        (final: prev: {
          stryke_force_website_dev = prev.poetry2nix.mkPoetryEnv {
            projectDir = ./.;
            groups = [ "main" "dev" ];
          };
          stryke_force_website = prev.poetry2nix.mkPoetryApplication {
            projectDir = ./.;
            groups = [ "main" ];
            postInstall = ''
              mkdir -p $out/bin/
              cp -vf manage.py $out/bin/
            '';
          };
        })
      ];

      nixosConfigurations.container =
        let
          system = "x86_64-linux";
        in
        nixpkgs.lib.nixosSystem {
          inherit system;
          modules = [
            self.nixosModules.${system}.default
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
          version = "4.0.0-pre";
          src = ./.;
          pkgs = import nixpkgs {
            inherit system;
            overlays = [ self.overlay ];
          };
        in
        {
          packages = {
            default = pkgs.stryke_force_website;

            # refresh venv for Pycharm with: nix build .#venv -o venv
            venv = pkgs.stryke_force_website_dev;

            static = pkgs.stdenv.mkDerivation {
              pname = "strykeforce-static";
              inherit version;
              inherit src;
              phases = "installPhase";
              installPhase = ''
                export DJANGO_SETTINGS_MODULE=website.settings.production
                export SECRET_KEY=
                export DATABASE_URL=
                export STATIC_ROOT=$out
                mkdir -p $out
                ${pkgs.stryke_force_website}/bin/manage.py collectstatic --no-input
              '';
            };
          };


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
                    pkg = self.packages.${system}.default.dependencyEnv;
                    static = self.packages.${system}.static;
                  in
                  {
                    wantedBy = [ "multi-user.target" ];

                    environment = {
                      DJANGO_SETTINGS_MODULE = cfg.settingsModule;
                      STATIC_ROOT = "${static}";
                      DATABASE_URL = databaseUrl;
                    };

                    preStart = "${pkg}/bin/manage.py migrate --no-input";

                    serviceConfig = {
                      ExecStart = "${pkg}/bin/gunicorn --bind 0.0.0.0:8000 website.wsgi";
                      User = "strykeforce";
                      Restart = "on-failure";
                    };
                  };
              };
            };



          devShell = pkgs.mkShell
            {
              buildInputs = with pkgs; [
                stryke_force_website_dev
                postgresql
                nodejs
                poetry
                pre-commit
              ] ++ lib.optional stdenv.isDarwin openssl;
            };
        }));
}
