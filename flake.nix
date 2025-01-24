{
  description = "Stryke Force Website built using uv2nix";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    pyproject-nix = {
      url = "github:nix-community/pyproject.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    uv2nix = {
      url = "github:adisbladis/uv2nix";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    pyproject-build-systems = {
      url = "github:pyproject-nix/build-system-pkgs";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.uv2nix.follows = "uv2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      uv2nix,
      pyproject-nix,
      pyproject-build-systems,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        inherit (nixpkgs) lib;
        workspace = uv2nix.lib.workspace.loadWorkspace { workspaceRoot = ./.; };

        overlay = workspace.mkPyprojectOverlay {
          sourcePreference = "wheel";
        };

        pythonSets =
          let
            baseSet = pkgs.callPackage pyproject-nix.build.packages {
              python = pkgs.python312;
            };

            pillowHeifOverrides = import ./lib/overrides-pillow-heif.nix { inherit pkgs; };
            psycopgOverrides = import ./lib/overrides-psycopg.nix { inherit pkgs; };
            opencvOverrides = import ./lib/overrides-opencv.nix { inherit pkgs; };
            tbaApiOverrides = import ./lib/overrides-tba-api-v3client.nix { inherit pkgs; };
          in
          baseSet.overrideScope (
            lib.composeManyExtensions [
              pyproject-build-systems.overlays.default
              overlay
              pillowHeifOverrides
              psycopgOverrides
              opencvOverrides
              tbaApiOverrides
            ]
          );

        inherit (pkgs.stdenv) mkDerivation;
        inherit (pkgs) writeShellApplication;

      in
      {
        packages = {
          venv = pythonSets.mkVirtualEnv "strykeforce-env" workspace.deps.default;

          static = mkDerivation {
            pname = "strykeforce-static";
            inherit (pythonSets.website) version;
            src = self;
            phases = "installPhase";
            installPhase = ''
              export DJANGO_SETTINGS_MODULE=website.settings.production
              export SECRET_KEY=notsecret
              export TBA_READ_KEY=
              export EMAIL_HOST_USER=
              export EMAIL_HOST_PASSWORD=
              export STATIC_ROOT=$out
              mkdir -p $out
              ${self.packages.${system}.venv}/bin/strykeforce-manage collectstatic --no-input
            '';
          };

          manage = import ./lib/manage.nix {
            inherit pkgs;
            inherit (self.packages.${system}) venv;
            inherit (self.packages.${system}) static;
          };

          manage-old = writeShellApplication {
            name = "strykeforce-manage";

            text = ''
              export DJANGO_SETTINGS_MODULE=website.settings.production
              export SECRET_KEY=notsecret
              export TBA_READ_KEY=
              export EMAIL_HOST_USER=
              export EMAIL_HOST_PASSWORD=
              export STATIC_ROOT=${self.packages.${system}.static}
              exec ${self.packages.${system}.venv}/bin/strykeforce-manage "$@"
            '';
          };

          # refresh venv for Pycharm with: nix build .#venv -o venv
          default = self.packages.${system}.venv;
        };

        apps = {
          default = {
            type = "app";
            program = "${self.packages.${system}.manage}/bin/strykeforce-manage";
          };
        };

        devShells.default =
          let
            pkgs = nixpkgs.legacyPackages.${system};
            packages = with pkgs; [
              cachix
              just
              nil
              nix-output-monitor
              nixfmt-rfc-style
              nodejs
              postgresql.dev
              pre-commit
              pythonSets.python
              tailwindcss
              uv2nix.packages.${system}.uv-bin
              watchman
            ];
          in
          pkgs.mkShell {
            inherit packages;
            shellHook = ''
              unset PYTHONPATH
              export UV_PYTHON_DOWNLOADS=never
            '';
          };
      }
    )
    // {
      nixosModules.strykeforce = import ./lib/module.nix self;
      nixosModules.default = self.nixosModules.strykeforce;

      nixosConfigurations.container = import ./lib/container.nix {
        inherit self nixpkgs;
      };
    };
}
