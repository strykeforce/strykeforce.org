{
  config,
  flake,
  inputs,
  modulesPath,
  pkgs,
  ...
}:
{
  imports = [
    (modulesPath + "/virtualisation/proxmox-lxc.nix")
    inputs.srvos.nixosModules.server
    flake.nixosModules.strykeforce-website
    inputs.agenix.nixosModules.default
    ./postgresql.nix
    ./strykeforce-sync.nix
    ./strykeforce-website.nix
  ];

  networking.hostName = "pallas";
  nixpkgs.hostPlatform = "x86_64-linux";
  proxmoxLXC.manageHostName = true;
  nix.optimise.automatic = true;

  services = {
    fstrim.enable = true;
    getty.autologinUser = "root";
    prometheus = {
      exporters = {
        node = {
          enable = true;
          enabledCollectors = [ "systemd" ];
          port = 9002;
          openFirewall = true;
        };
      };
    };
  };

  environment.systemPackages = with pkgs; [
    ghostty.terminfo
    mailutils
  ];

  networking = {
    domain = "lan.j3ff.io";
    search = [ "lan.j3ff.io" ];

    nameservers = [
      "1.1.1.1"
      "1.0.0.1"
      "8.8.8.8"
      "8.8.4.4"
    ];
  };

  services.tailscale.enable = true;
  services.tailscale.openFirewall = true;

  age.secrets.sasl_passwd = {
    file = ./sasl_passwd.age;
  };

  systemd.services.postfix.preStart = ''
    ln -sf ${config.age.secrets.sasl_passwd.path} /etc/postfix/sasl_passwd
    ${pkgs.postfix}/bin/postmap /etc/postfix/sasl_passwd
  '';

  services.postfix = {
    enable = true;
    inherit (config.networking) domain;
    rootAlias = "jeff@j3ff.io";
    settings.main = {
      mydomain = config.networking.domain;
      relayhost = [ "[smtp.fastmail.com]:587" ];
      "append_dot_mydomain" = "yes";
      "smtp_sasl_auth_enable" = "yes";
      "smtp_sasl_password_maps" = "hash:/etc/postfix/sasl_passwd";
      "smtp_sasl_security_options" = "noanonymous";
      "inet_protocols" = "ipv4";
    };
  };

  users.users.root = {
    # https://start.1password.com/open/i?a=7Z533SZAYZCNVL764G5INOV75Q&v=lwpxghrefna57cr6nw7mr3bybm&i=v6cyausjzre6hjypvdsfhlkbty&h=my.1password.com
    hashedPassword = "$y$j9T$6B8V0Z9VkFiU0fMwSuLrA0$z3YHuwwAZro3N7TopVIsNltIJ5BXt3TQj1wQqt5HSuD";
    openssh.authorizedKeys.keys = [
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPqpWpNJzfzioGYyR9q4wLwPkBrnmc/Gdl6JsO+SUpel jeff@j3ff.io"
    ];
  };

  system.stateVersion = "21.11";
}
