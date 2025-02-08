{ inputs, ... }:
{
  class = "nixos";

  value = inputs.staging.nixosConfigurations.pallas;
}
