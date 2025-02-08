{
  config,
  flake,
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    flake.modules.nixos.server
  ];

  networking.hostName = "venus";

  system.stateVersion = "24.11";
}
