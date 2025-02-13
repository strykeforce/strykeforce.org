{
  config,
  flake,
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    flake.modules.nixos.hardware-amazon-ec2
    flake.modules.nixos.server
    inputs.agenix.nixosModules.default
    flake.modules.nixos.strykeforce-website
    inputs.wmra.nixosModules.website
    ./rclone.nix
  ];

  networking.hostName = "mercury";
  nixpkgs.hostPlatform = "x86_64-linux";

  age.secrets.stryker_website_secrets = {
    file = ./strykeforce_website_secrets.age;
  };

  environment.systemPackages = with pkgs; [
    redli
  ];

  strykeforce.services.website = {
    enable = true;
    settingsModule = "website.settings.production";
    secrets = [ config.age.secrets.stryker_website_secrets.path ];
  };

  services.postgresql = {
    enable = true;
    package = pkgs.postgresql_15;
  };

  services.postgresqlBackup = {
    enable = true;
    databases = [ "strykeforce" ];
    pgdumpOptions = "--clean";
  };

  security.acme.acceptTerms = true;
  security.acme.defaults.email = "jeff@j3ff.io";

  system.stateVersion = "21.11";
}
