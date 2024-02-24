self: { config, lib, pkgs, ... }:
let
  cfg = config.strykeforce.services.website;
  stateDir = "/var/lib/strykeforce";
in
{
  options.strykeforce.services.website = {
    enable = lib.mkEnableOption "Enable the Stryke Force website service";

    ssl = lib.mkOption {
      default = true;
      type = lib.types.bool;
      description = lib.mdDoc ''
        Whether to enable SSL/TLS in Nginx.
      '';
    };

    settingsModule = lib.mkOption {
      type = lib.types.str;
      default = "website.settings.production";
    };

    allowedHosts = lib.mkOption {
      type = lib.types.str;
      default = "strykeforce.org www.strykeforce.org";
    };
  };

  config = lib.mkIf cfg.enable {

    users = {
      users.strykeforce = {
        isSystemUser = true;
        group = "strykeforce";
        extraGroups = [ "redis" ];
      };
      groups.strykeforce = { };
    };

    systemd.tmpfiles.rules = [
      "d ${stateDir} 0775 strykeforce strykeforce -"
    ];

    systemd.services.strykeforce-website =
      let
        website = self.packages.${pkgs.system}.website.dependencyEnv;
        static = self.packages.${pkgs.system}.static;
      in
      {
        wantedBy = [ "multi-user.target" ];
        requires = [ "postgresql.service" ];
        after = [ "postgresql.service" ];

        environment = {
          DJANGO_SETTINGS_MODULE = cfg.settingsModule;
          ALLOWED_HOSTS = cfg.allowedHosts;
          STATIC_ROOT = "${static}";
          MEDIA_ROOT = "${stateDir}/media";
        };

        preStart = "${website}/bin/manage.py migrate --no-input";

        serviceConfig = {
          EnvironmentFile = "/run/agenix/stryker_website_secrets";
          ExecStart = "${website}/bin/gunicorn --workers=5 --bind=127.0.0.1:8000 website.wsgi";
          User = "strykeforce";
          Restart = "on-failure";
        };
      };


    services.postgresql = {
      ensureDatabases = [ "strykeforce" ];
      ensureUsers = [
        {
          name = "strykeforce";
          ensureDBOwnership = true;
        }
      ];
    };

    systemd.services.postgresql.postStart = ''
      $PSQL -d strykeforce -tA << END_INPUT
        CREATE SCHEMA IF NOT EXISTS strykeforce AUTHORIZATION "strykeforce";
        ALTER ROLE strykeforce SET client_encoding TO 'utf8';
        ALTER ROLE strykeforce SET default_transaction_isolation TO 'read committed';
        ALTER ROLE strykeforce SET timezone TO 'UTC';
      END_INPUT
    '';

    services.redis.servers."" = {
      enable = true;
      save = [ ];
    };
    systemd.services.redis.partOf = [ "strykeforce-website.service" ];

    services.nginx = {
      enable = true;
      recommendedProxySettings = true;
      recommendedOptimisation = true;
      recommendedGzipSettings = true;


      virtualHosts."www.strykeforce.org" = {
        # security.acme is configured for mercury globally
        forceSSL = cfg.ssl;
        enableACME = cfg.ssl;
        serverAliases = [ "strykeforce.org" "mercury.strykeforce.org" ];

        locations = {
          "/" = {
            proxyPass = "http://127.0.0.1:8000";
          };

          "/media/" = {
            alias = "${stateDir}/media/";
            extraConfig = ''
              expires max;
              add_header Cache-Control public;
            '';
          };
        };
      };
    };

    security.acme.certs = lib.mkIf cfg.ssl {
      "www.strykeforce.org".email = "jeff@j3ff.io";
    };
  };
}
