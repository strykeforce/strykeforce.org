# strykeforce.org

## Copy or restore production data

To restore database from backup:

```sh
zcat strykeforce.sql.gz | psql -d strykeforce
cd media
tar xf ../images.tar
cd ..
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
