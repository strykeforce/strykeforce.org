{ modulesPath, pkgs, ... }: {
  imports = [ "${modulesPath}/virtualisation/amazon-image.nix" ];
  ec2.hvm = true;

  networking.hostName = "mercury";
  networking.firewall.allowedTCPPorts = [ 80 443 ];

  systemd.services.amazon-init.enable = false;

  environment.systemPackages = with pkgs; [ bat htop redli ];
  programs = {
    git.enable = true;
    vim.defaultEditor = true;
  };

  nix.extraOptions = ''
    auto-optimise-store = true
    experimental-features = nix-command flakes
  '';

  system.stateVersion = "21.11";
}
