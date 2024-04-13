# just manual: https://just.systems/man/en/

_default:
  @just --list

# bootstrap the development environment
bootstrap: venv pre-commit

# open the project in Pycharm
edit:
  pycharm .

# run the development server
run check="none":
    python {{ if check != "none" { "-X dev" } else { "" } }} manage.py runserver

push:
    nix build --json .#website | jq -r '.[].outputs | to_entries[].value' | cachix push strykeforce
    nix build --json .#static | jq -r '.[].outputs | to_entries[].value' | cachix push strykeforce

# update CSS and download all JS dependencies
update: venv update-css update-alpine

# update CSS with classes from HTML templates
update-css:
    tailwindcss -i website/static/css/base.css -o website/static/css/main.css

# watch HTML templates and update CSS
watch:
    tailwindcss -i website/static/css/base.css -o website/static/css/main.css --watch

# download all JS dependencies
update-alpine:
    curl --no-progress-meter --location https://unpkg.com/alpinejs --output website/static/js/alpine.js

# update dev dependencies to latest version
update-dev: && poetry-check
    poetry add --group=dev --lock black@latest
    # poetry add --group=dev --lock django-debug-toolbar@latest
    poetry add --group=dev --lock ipython@latest
    poetry add --group=dev --lock rich@latest

# checks poetry.lock against the version of pyproject.toml and locks if neccessary
poetry-check:
    poetry check --lock --quiet || (just poetry-lock)

# locks the python packages in pyproject.toml without updating the poetry env
poetry-lock:
    poetry lock --no-update

# install pre-commit hooks
pre-commit:
    pre-commit install --install-hooks

# refresh the python packages in the dev env
venv: poetry-check
    nix build .#venv -o .venv

# grep for version
version:
    @rg "version = " -m 1 pyproject.toml flake.nix

# supply a new project version for pyproject.toml and flake.nix
set-version version:
    @sed --in-place 's/^version = ".*"/version = "{{ version }}"/' pyproject.toml
    @sed --in-place --regexp-extended 's/(\s+version = )".*";/\1"{{ version }}";/' flake.nix
    @git diff -U0 pyproject.toml flake.nix
