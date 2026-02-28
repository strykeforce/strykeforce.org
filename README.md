# strykeforce.org

## Tech stack

- **Backend:** Python 3.12 with Django 5 and Wagtail 6 for CMS and site
  content.
- **Frontend:** Tailwind CSS 4, Alpine.js, and esbuild for styling and
  lightweight interactivity.
- **Runtime services:** PostgreSQL (via psycopg), Redis, Gunicorn, and
  WhiteNoise.
- **Deployment:** Nix flakes with NixOS on EC2, with recipes in `justfile`
  and host config under `nix/`.

## Installation on EC2 server

Find a recent [NixOS AMI](https://nixos.org). Use a x86_64 (t3, not t2) instance type to enable serial console. Install SSH public key during installation and log in using public IP.

Examine `justfile` for staging and production deployment recipes.

```sh
just stage <how>
```

Where `<how>` is one of (switch | boot | test | build | dry-build | dry-activate | edit | repl | build-vm | build-vm-with-bootloader) arguments to `nixos-rebuild` command.

## Copy or restore production data

See script in `nix/hosts/pallas/strykeforce-sync.nix`.

## Server Management

```sh
# as root
# strykeforce-manage is installed on the production server
$ strykeforce-manage help
```
