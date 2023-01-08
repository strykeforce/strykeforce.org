# strykeforce.org

## Database

```sh
 sudo -u postgres psql
```

```sql
ALTER ROLE strykeforce WITH PASSWORD '<password>';
```

## Server Management

To run `manage.py` commands, check out the repo on the host server and set up the `.envrc`:

```
use flake
export TBA_READ_KEY=<key>
export DATABASE_URL=postgres://strykeforce:<password>@127.0.0.1:5432/strykeforce
```
