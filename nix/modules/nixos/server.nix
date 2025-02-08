{
  flake,
  inputs,
  ...
}:
{
  imports = [
    flake.modules.nixos.hardware-amazon-ec2
    inputs.srvos.nixosModules.server
  ];
  services.getty.autologinUser = "root";

  nix.settings = {
    substituters = [
      "https://strykeforce.cachix.org"
    ];

    trusted-public-keys = [
      "strykeforce.cachix.org-1:+ux184cQfS4lruf/lIzs9WDMtOkJIZI2FQHfz5QEIrE="
    ];
  };

  users.users.root = {
    hashedPassword = "$y$j9T$6B8V0Z9VkFiU0fMwSuLrA0$z3YHuwwAZro3N7TopVIsNltIJ5BXt3TQj1wQqt5HSuD";
    openssh.authorizedKeys.keys = [
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPqpWpNJzfzioGYyR9q4wLwPkBrnmc/Gdl6JsO+SUpel jeff@j3ff.io"
    ];
  };
}
