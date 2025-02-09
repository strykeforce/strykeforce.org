{
  flake,
  inputs,
  pkgs,
  perSystem,
  ...
}:
{
  imports = [
    inputs.staging.nixosModules.hardware-proxmox-lxc
    inputs.staging.nixosModules.server-j3ff
    flake.nixosModules.strykeforce-website
    ./postgresql.nix
    ./strykeforce-sync.nix
    ./strykeforce-website.nix
  ];

  networking.hostName = "pallas";
  nixpkgs.hostPlatform = "x86_64-linux";

  system.stateVersion = "21.11";
}
