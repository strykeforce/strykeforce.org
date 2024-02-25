# strykeforce.org

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

In production, look up the deployed derivation using `systemctl cat
strykeforce-website` and run `manage.py` as user `strykeforce` with required
environment variable set:

```
sudo -u strykeforce env \
  DJANGO_SETTINGS_MODULE=website.settings.production \
  TBA_READ_KEY= \
  SECRET_KEY=<something> \
  $NIX_STORE_PATH/bin/manage.py
```


## Testing NixOS module in Container

```
sudo nixos-container create flake-test --flake .
sudo nixos-container start flake-test
sudo nixos-container root-login flake-test
sudo nixos-container destroy flake-test
```
