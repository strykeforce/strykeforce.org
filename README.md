# strykeforce.org

## Installation

Find a recent [NixOS AMI](https://nixos.org). Use a x86_64 (t3, not t2) instance type to enable serial console. Install SSH public key during installation and log in using public IP.

```sh
nixos-rebuild --flake .#venus --target-host root@venus boot
```

## Copy or restore production data

To restore database from backup, assumes `rclone` and `aws` credential files in place:

```sql
-- create schema in database strykeforce
CREATE ROLE "strykeforce";
CREATE SCHEMA IF NOT EXISTS "strykeforce" AUTHORIZATION "strykeforce";
```

```sh
# data
aws s3 cp s3://www.strykeforce.org/sql/strykeforce.sql.gz .
zcat strykeforce.sql.gz | psql -d strykeforce

# images and documents
rclone -v sync s3://www.strykeforce.org/media/ ./media
./manage.py wagtail_update_image_renditions
```

## Server Management

```sh
# as root
# strykeforce-manage is installed on the production server
$ strykeforce-manage help

# otherwise
$ nix registry add strykeforce-manage "github:strykeforce/strykeforce.org"
$ nix run strykeforce-manage -- help
```

## Testing NixOS module in Container

```
sudo nixos-container create flake-test --flake .
sudo nixos-container start flake-test
sudo nixos-container root-login flake-test
sudo nixos-container destroy flake-test
```

## Override python build configs temporarily

```nix
overrides = poetry2nixPkgs.defaultPoetryOverrides.extend
  (self: super: {
    opencv-python = super.opencv4;

    # keep until https://github.com/nix-community/poetry2nix/pull/1602 merged
    sqlparse = super.sqlparse.overridePythonAttrs (old: {
      buildInputs = (lists.remove super.flit-core old.buildInputs) ++ [ super.hatchling ];
    });
  });

# ...

website = mkPoetryApplication {
  inherit overrides;
  # ...
```
