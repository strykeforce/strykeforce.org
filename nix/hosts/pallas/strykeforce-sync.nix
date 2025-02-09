{ config, pkgs, ... }:
{
  age.secrets.aws_credentials = {
    file = ./aws_secret.age;
    path = "/root/.aws/credentials";
  };

  systemd.services.copy-aws-config =
    let
      aws-config = (pkgs.formats.ini { }).generate "aws-config-root" {
        default = {
          region = "us-east-2";
          output = "json";
        };
      };
    in
    {
      serviceConfig = {
        Type = "oneshot";
        ExecStart = "${pkgs.coreutils}/bin/ln -sf ${aws-config} /root/.aws/config";
      };
      wantedBy = [ "multi-user.target" ];
    };

  environment.systemPackages =
    let
      sync-script = pkgs.writeShellApplication {
        name = "strykeforce-sync";
        runtimeInputs = with pkgs; [
          awscli2
          gzip
          postgresql_15
          rclone
        ];

        text = ''
          if [ "$EUID" -ne 0 ]
            then echo "Please run as root"
            exit
          fi
          systemctl stop strykeforce-website.service

          STRYKEFORCE_DIR=/var/lib/strykeforce
          SQL_FILE=$(mktemp -t XXXXXXXXXX.sql.gz)

          aws s3 cp s3://www.strykeforce.org/sql/strykeforce.sql.gz "$SQL_FILE"
          rclone -v sync s3://www.strykeforce.org/media/ $STRYKEFORCE_DIR/media
          chown -R strykeforce:strykeforce $STRYKEFORCE_DIR/media


          sudo -u postgres -H -- psql -tAc 'DROP DATABASE IF EXISTS "strykeforce"'
          sudo -u postgres -H -- psql -tAc 'CREATE DATABASE "strykeforce"'
          sudo -u postgres -H -- psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='strykeforce'" | grep -q 1 || psql -tAc 'CREATE USER "strykeforce"'
          sudo -u postgres -H -- psql -tAc 'GRANT ALL PRIVILEGES ON DATABASE strykeforce TO "strykeforce"'

          zcat "$SQL_FILE" | sudo -u postgres -H -- psql -d strykeforce
          systemctl start strykeforce-website.service
          systemctl start redis.service
        '';
      };
    in
    [ sync-script ];
}
