# AGENTS.md

Wagtail/Django site for FRC team 2767. Python package is `website/`
(apps: `blog`, `home`, `events`, `members`, `search`); Nix flake in `nix/`
(numtide blueprint, `prefix = "nix/"`) builds, checks, and deploys it.

## Environment

- Dev shell comes from `nix develop` via direnv (`.envrc`). Python deps are
  managed by `uv` (`uv.lock`); run Python via `uv run --no-sync ...`.
- `TBA_READ_KEY` must be set (even empty) or settings import fails with
  `KeyError`; it lives in `.envrc.local` (never print or commit it).
- `manage.py` defaults to `website.settings.dev`, which uses a local
  PostgreSQL db `strykeforce` with `search_path=strykeforce,public`.
  `website/settings/local.py` (gitignored) is imported if present.

## Commands (see `justfile`)

- `just run` - dev server; `just manage "<cmd>"` - any manage.py command.
- `just makemigrations` / `just migrate` - commit generated migrations.
- `just manage seed_sample_data` seeds schools, students, and mentors.
  `just manage import_events` pulls events from The Blue Alliance (needs a
  real `TBA_READ_KEY`).
- `just test` runs all tests against Postgres (`--keepdb`).
- Fast tests without Postgres (same as the Nix check), run from repo root
  because fixtures use relative paths
  (`website/events/tests/2024_data.pickle`):

  ```sh
  DJANGO_SETTINGS_MODULE=website.settings.test TBA_READ_KEY= \
    uv run --no-sync website/manage.py test website.events.tests
  ```

- `just update-css` / `just update-js` / `just watch` - build Tailwind 4 and
  esbuild output. Edit `website/static/2767/base.css` and `base.js` only;
  `main.css`/`main.js` are generated and gitignored.

## Checks and CI

- CI runs only `nix flake check`: pre-commit hooks, Django unit tests
  (`nix/packages/venv.nix`), and a NixOS VM integration test
  (`nix/checks/website-integration-tests.nix`).
- Hooks are defined in `nix/checks/pre-commit.nix`;
  `.pre-commit-config.yaml` is generated - do not edit. Hooks: ruff +
  ruff format (line length 99), pyupgrade `--py312-plus`,
  add-trailing-comma, django-upgrade `--target-version=5.2`, djade for
  templates, nixfmt, and a 25 KB max added file size.

## Nix gotchas

- Changing `package-lock.json` requires updating `npmDepsHash` in
  `nix/packages/static.nix`, or the static build fails.
- Python deps with native builds may need an override in
  `nix/lib/overrides/` (existing: opencv, pillow-heif, psycopg, tba-api).
- Hosts: `pallas` = staging (`just stage`), `mercury` = production
  (`just deploy`, defaults to `dry-activate`). Deploys need NixOS
  `nixos-rebuild`; never deploy unless asked. Secrets are agenix `.age`
  files under `nix/hosts/`.

## VCS

- Colocated Jujutsu repo (`.jj/`): use `jj`, not raw `git`. Trunk is `main`.
