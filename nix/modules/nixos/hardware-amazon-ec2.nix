{ lib, modulesPath, ... }:
{
  imports = [
    "${modulesPath}/virtualisation/amazon-image.nix"
    inputs.srvos.nixosModules.mixins-cloud-init
  ];
  nixpkgs.hostPlatform = "x86_64-linux";
  ec2.hvm = true;
  services.amazon-ssm-agent.enable = lib.mkForce false;
}
