{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
    sfdo.url = "github:jhh/sfdo";
  };

  outputs = { self, nixpkgs, utils, sfdo }:
    let out = system:
      let pkgs = nixpkgs.legacyPackages."${system}";
      in
      {

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            sfdo.packages.${system}.default
          ] ++ lib.optional (system != "x86_64-darwin") hugo;
        };

        packages.default = with pkgs.poetry2nix; mkPoetryApplication {
          projectDir = ./.;
          preferWheels = true;
        };

        apps.default = utils.lib.mkApp {
          drv = self.packages."${system}".default;
        };

      };
    in with utils.lib; eachSystem defaultSystems out;


}
