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
      version = "4.1.9"; # also update pyproject.toml
    in
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          poetry2nixPkgs = poetry2nix.lib.mkPoetry2Nix { inherit pkgs; };
          inherit (poetry2nixPkgs) mkPoetryEnv mkPoetryApplication;
          inherit (pkgs.stdenv) mkDerivation;
          inherit (pkgs) writeShellApplication;
          inherit (pkgs.lib) lists;

          overrides = poetry2nixPkgs.defaultPoetryOverrides.extend
            (self: super: {
              opencv-python = super.opencv4;
            });

        in
        {
          packages = {
            website = mkPoetryApplication {
              pname = "strykeforce-website";
              projectDir = self;
              groups = [ "main" ];
              inherit overrides;

              patchPhase = ''
                ${pkgs.tailwindcss}/bin/tailwindcss -i website/static/css/base.css -o website/static/css/main.css --minify
              '';

              postInstall = ''
                mkdir -p $out/bin/
                cp -vf manage.py $out/bin/
              '';
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
              inherit overrides;
            };

            # refresh venv for Pycharm with: nix build .#venv -o venv
            venv = self.packages.${system}.devEnv;
            default = self.packages.${system}.website;
          };


          devShells.default = pkgs.mkShell
            {
              buildInputs = with pkgs; [
                cachix
                just
                nodejs
                poetry
                pre-commit
                self.packages.${system}.devEnv
                tailwindcss
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
