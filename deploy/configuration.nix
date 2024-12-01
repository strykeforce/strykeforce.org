{ modulesPath, pkgs, ... }: {
  imports = [ "${modulesPath}/virtualisation/amazon-image.nix" ];
  ec2.hvm = true;

  services.getty.autologinUser = pkgs.lib.mkDefault "root";

  networking.hostName = "mercury";
  networking.firewall.allowedTCPPorts = [ 80 443 ];

  systemd.services.amazon-init.enable = false;

  nix.settings = {
    substituters = [
      "https://strykeforce.cachix.org"
    ];

    trusted-public-keys = [
      "strykeforce.cachix.org-1:+ux184cQfS4lruf/lIzs9WDMtOkJIZI2FQHfz5QEIrE="
    ];
  };

  environment.systemPackages = with pkgs; [ bat htop vim ];
  programs = {
    git.enable = true;
    vim.enable = true;
    vim.defaultEditor = true;
  };

  # Notice this also disables --help for some commands such es nixos-rebuild
  documentation.enable = false;
  documentation.info.enable = false;
  documentation.man.enable = false;
  documentation.nixos.enable = false;

  # No need for fonts on a server
  fonts.fontconfig.enable = false;

  # Print the URL instead on servers
  environment.variables.BROWSER = "echo";

  nix.extraOptions = ''
    auto-optimise-store = true
    experimental-features = nix-command flakes
  '';

  nix.gc = {
    automatic = true;
    dates = "weekly";
    options = "--delete-older-than 14d";
    randomizedDelaySec = "1h";
  };

  system.stateVersion = "21.11";
}
