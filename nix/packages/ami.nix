{ flake, inputs, ... }:
inputs.nixos-generators.nixosGenerate {
  system = "x86_64-linux";
  modules = [
    flake.modules.nixos.server
    (
      { ... }:
      {
        system.stateVersion = "24.11";
      }
    )
  ];
  format = "amazon";

}
