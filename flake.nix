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
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          inherit (poetry2nix.legacyPackages.${system}) mkPoetryEnv mkPoetryApplication;
          pkgs = nixpkgs.legacyPackages.${system};
          inherit (pkgs.stdenv) mkDerivation;
          inherit (pkgs) writeShellApplication;
          opencv-overrides = poetry2nix.legacyPackages.${system}.overrides.withDefaults (self: super: {
            opencv-python-headless = super.opencv-python-headless.overridePythonAttrs
              (
                old: {
                  nativeBuildInputs = (old.nativeBuildInputs or [ ]) ++ [ super.ninja ];
                }
              );
          });
        in
        {
          packages = {
            website = mkPoetryApplication {
              pname = "strykeforce-website";
              inherit version;
              projectDir = self;
              groups = [ "main" ];
              postInstall = ''
                mkdir -p $out/bin/
                cp -vf manage.py $out/bin/
              '';
#              overrides = opencv-overrides;
              preferWheels = true;
            };

            static = mkDerivation {
              pname = "strykeforce-static";
              inherit version;
              src = self;
              phases = "installPhase";
              installPhase = ''
                export DJANGO_SETTINGS_MODULE=website.settings.production
                export SECRET_KEY=
                export TBA_READ_KEY=
                export EMAIL_HOST_USER=
                export EMAIL_HOST_PASSWORD=
                export STATIC_ROOT=$out
                mkdir -p $out
                ${self.packages.${system}.website}/bin/manage.py collectstatic --no-input
              '';
            };

            manage = writeShellApplication {
              name = "strykeforce-manage";

              text = ''
                export DJANGO_SETTINGS_MODULE=website.settings.production
                export SECRET_KEY=notsecret
                export TBA_READ_KEY=
                export EMAIL_HOST_USER=
                export EMAIL_HOST_PASSWORD=
                export STATIC_ROOT=${self.packages.${system}.static}
                exec ${self.packages.${system}.website}/bin/manage.py "$@"
              '';
            };

            devEnv = mkPoetryEnv {
              projectDir = self;
              groups = [ "main" "dev" ];
            };

            # refresh venv for Pycharm with: nix build .#venv -o venv
            venv = self.packages.${system}.devEnv;

            default = self.packages.${system}.website;
          };


          devShells.default = pkgs.mkShell
            {
              buildInputs = with pkgs; [
                self.packages.${system}.devEnv
                postgresql
                nodejs
                poetry
                pre-commit
                sqlite
                zlib
              ] ++ lib.optional stdenv.isDarwin openssl;
            };
        }) // {
      nixosModules.strykeforce = import ./nix/module.nix self;
      nixosModules.default = self.nixosModules.strykeforce;

      nixosConfigurations.container = import ./nix/container.nix {
        inherit self nixpkgs;
      };
    };
}
