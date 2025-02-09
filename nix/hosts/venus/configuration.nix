{ flake, ... }:
{
  imports = [
    flake.modules.nixos.hardware-amazon-ec2
    flake.modules.nixos.server
  ];

  nixpkgs.hostPlatform = "x86_64-linux";
  networking.hostName = "venus";

  system.stateVersion = "24.11";
}
