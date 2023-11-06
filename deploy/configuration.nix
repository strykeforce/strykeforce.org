{ modulesPath, pkgs, ... }: {
  imports = [ "${modulesPath}/virtualisation/amazon-image.nix" ];
  ec2.hvm = true;

  services.getty.autologinUser = pkgs.lib.mkDefault "root";

  networking.hostName = "mercury";
  networking.firewall.allowedTCPPorts = [ 80 443 ];

  systemd.services.amazon-init.enable = false;

  environment.systemPackages = with pkgs; [ bat htop vim ];
  programs = {
    git.enable = true;
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

  system.stateVersion = "21.11";
}
