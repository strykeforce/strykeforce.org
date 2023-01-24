{ self, nixpkgs }:
let
  system = "x86_64-linux";
in
nixpkgs.lib.nixosSystem {
  inherit system;
  modules = [
    self.nixosModules.strykeforce
    ({ ... }: {
      boot.isContainer = true;
      networking.useDHCP = false;
      networking.firewall.enable = false;
      strykeforce.services.website = {
        enable = true;
        ssl = false;
        settingsModule = "website.settings.test";
      };
      system.stateVersion = "23.05";
    })
  ];
}
