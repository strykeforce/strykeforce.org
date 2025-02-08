{ lib, modulesPath, ... }:
{
  imports = [
    "${modulesPath}/virtualisation/amazon-image.nix"
  ];
  nixpkgs.hostPlatform = "x86_64-linux";
  ec2.hvm = true;
  systemd.services.amazon-init.enable = false;
  services.cloud-init.enable = false;
  services.amazon-ssm-agent.enable = lib.mkForce false;
}
