{
  description = "Stryke Force Website built using poetry2nix";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.poetry2nix = {
    url = "github:nix-community/poetry2nix";
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


      nixosModules.strykeforce = import ./nix/module.nix;
      nixosModules.default = self.nixosModules.strykeforce;

      nixosConfigurations.container =
        let
          system = "x86_64-linux";
        in
        nixpkgs.lib.nixosSystem {
          inherit system;
          modules = [
            self.nixosModules.strykeforce
            ({ ... }: {
              boot.isContainer = true;
              networking.useDHCP = false;
              networking.firewall.enable = false;
              strykeforce.services.website = {
                enable = true;
                ssl = false;
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
