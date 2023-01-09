# strykeforce.org

## Database

```sh
 sudo -u postgres psql
```

```sql
ALTER ROLE strykeforce WITH PASSWORD '<password>';
```

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

To run `manage.py` commands, check out the repo on the host server and set up the `.envrc`:

```
use flake
export TBA_READ_KEY=<key>
```
