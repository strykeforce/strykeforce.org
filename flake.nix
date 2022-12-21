{
  description = "Behold My Awesome Project!";

  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.poetry2nix = {
    url = "github:nix-community/poetry2nix";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, poetry2nix }:
    {
      # Nixpkgs overlay providing the application
      overlay = nixpkgs.lib.composeManyExtensions [
        poetry2nix.overlay
        (final: prev: {
          stryke_force_website_dev = prev.poetry2nix.mkPoetryEnv {
            projectDir = ./.;
            groups = [ "main" "dev" ];
          };
          stryke_force_website = prev.poetry2nix.mkPoetryEnv {
            projectDir = ./.;
            groups = [ "main" ];
          };
        })
      ];
    } // (flake-utils.lib.eachDefaultSystem (system:
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
          venv = pkgs.stryke_force_website_dev;
          static = pkgs.stdenv.mkDerivation {
            pname = "strykeforce-static";
            inherit version;
            inherit src;
            phases = "installPhase";
            installPhase = ''
              export DJANGO_SETTINGS_MODULE=website.settings.production
              export STATIC_ROOT=$out
              mkdir -p $out
              ${pkgs.stryke_force_website}/bin/python ${src}/manage.py collectstatic --no-input
            '';
          };
        };



        devShell = pkgs.mkShell {
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
