{
  description = "Deploy strykeforce.org";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    deploy-rs = {
      url = "github:serokell/deploy-rs";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    agenix = {
      url = "github:ryantm/agenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    strykeforce = {
      url = "path:../";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    { self
    , agenix
    , deploy-rs
    , nixpkgs
    , strykeforce
    , ...
    }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShellNoCC {
        packages = [
          deploy-rs.packages.${system}.deploy-rs
          agenix.packages.${system}.agenix
        ];
      };

      nixosConfigurations.strykeforce =
        let
          enable = true;
        in
        nixpkgs.lib.nixosSystem {
          inherit system;
          modules = [
            ./configuration.nix
            ./rclone.nix
            agenix.nixosModule
            strykeforce.nixosModule
            ({ config, pkgs, ... }: {
              age.secrets.stryker_website_secrets = {
                file = ./strykeforce_website_secrets.age;
              };

              strykeforce.services.website = {
                inherit enable;
                settingsModule = "website.settings.production";
              };

              services.postgresql = {
                inherit enable;
                package = pkgs.postgresql_15;
              };

              services.postgresqlBackup = {
                inherit enable;
                databases = [ "strykeforce" ];
                pgdumpOptions = "--clean";
              };
            })
          ];
        };


      deploy.nodes.strykeforce = {
        hostname = "mercury.strykeforce.org";
        sshUser = "root";
        profiles.system = {
          user = "root";
          path = deploy-rs.lib.${system}.activate.nixos self.nixosConfigurations.strykeforce;
        };
      };

      checks = builtins.mapAttrs (system: deployLib: deployLib.deployChecks self.deploy) deploy-rs.lib;

    };
}
