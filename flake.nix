{
  description = "Stryke Force Website built using poetry2nix";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.poetry2nix = {
    #url = "github:nix-community/poetry2nix";
    url = "github:jhh/poetry2nix/fix-opencv";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, poetry2nix }:
    let
      version = "4.0.0";
    in
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          poetry2nixPkgs = poetry2nix.lib.mkPoetry2Nix { inherit pkgs; };
          inherit (poetry2nixPkgs) mkPoetryEnv mkPoetryApplication;
          inherit (pkgs.stdenv) mkDerivation;
          inherit (pkgs) writeShellApplication;
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
                just
                nodejs
                poetry
                pre-commit
                self.packages.${system}.devEnv
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
