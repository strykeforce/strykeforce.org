# strykeforce.org

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
