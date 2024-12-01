{
  description = "Deploy strykeforce.org";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    deploy-rs.url = "github:serokell/deploy-rs";
    strykeforce.url = "github:strykeforce/strykeforce.org";

    agenix = {
      url = "github:ryantm/agenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nixos-configs = {
      url = "github:jhh/nixos-configs";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.strykeforce.follows = "strykeforce";
    };
  };

  outputs =
    { self
    , agenix
    , deploy-rs
    , nixos-configs
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

      # pallas is staging server
      nixosConfigurations.pallas = nixos-configs.nixosConfigurations.pallas;

      nixosConfigurations.strykeforce =
        let
          enable = true;
          strykeforce-manage = strykeforce.packages.${pkgs.system}.manage;
        in
        nixpkgs.lib.nixosSystem {
          inherit system;
          modules = [
            ./configuration.nix
            ./rclone.nix
            agenix.nixosModules.default
            strykeforce.nixosModules.default
            ({ config, pkgs, ... }: {
              age.secrets.stryker_website_secrets = {
                file = ./strykeforce_website_secrets.age;
              };

              environment.systemPackages = with pkgs; [
                goaccess
                redli
                strykeforce-manage
              ];

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

              security.acme.acceptTerms = true;
              security.acme.defaults.email = "jeff@j3ff.io";
            })
          ];
        };


      deploy.nodes =
        let
          sshUser = "root";
          fastConnection = true;

          systemFor = host: {
            user = "root";
            path = deploy-rs.lib.x86_64-linux.activate.nixos self.nixosConfigurations.${host};
          };
        in
        {
          pallas = {
            hostname = "10.1.0.47";
            inherit sshUser fastConnection;
            profiles.system = systemFor "pallas";
          };

          strykeforce = {
            hostname = "mercury.strykeforce.org";
            inherit sshUser;
            profiles.system = systemFor "strykeforce";
          };

        };
      checks = builtins.mapAttrs (system: deployLib: deployLib.deployChecks self.deploy) deploy-rs.lib;
    };
}
