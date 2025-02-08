{ config, pkgs, ... }:
{
  age.secrets.rclone_conf = {
    file = ./strykeforce_s3_secrets.age;
  };

  systemd.services.strykeforce-backup = {
    startAt = "*-*-* 03:20:00";

    script = ''
      RCLONE_OPTS="--config ${config.age.secrets.rclone_conf.path} -v"

      src=/var/lib/strykeforce/media
      echo backing up $src
      ${pkgs.rclone}/bin/rclone $RCLONE_OPTS sync $src strykeforce-s3:www.strykeforce.org/media

      src=/var/backup/postgresql
      echo backing up $src
      ${pkgs.rclone}/bin/rclone $RCLONE_OPTS sync $src strykeforce-s3:www.strykeforce.org/sql
    '';
  };

}
