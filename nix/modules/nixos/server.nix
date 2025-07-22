{ inputs, pkgs, ... }:
let
  inherit (inputs.nixpkgs.lib) mkForce;
in
{
  imports = [
    inputs.srvos.nixosModules.server
  ];
  services.getty.autologinUser = "root";
  security.sudo.execWheelOnly = mkForce false;

  environment.systemPackages = with pkgs; [
    file
    ghostty.terminfo
    mailutils
  ];

  nix = {
    gc = {
      automatic = true;
      dates = "weekly";
      options = "--delete-older-than 14d";
      randomizedDelaySec = "1h";
    };
    settings = {
      substituters = [
        "https://strykeforce.cachix.org"
      ];

      trusted-public-keys = [
        "strykeforce.cachix.org-1:+ux184cQfS4lruf/lIzs9WDMtOkJIZI2FQHfz5QEIrE="
      ];
    };
  };

}
