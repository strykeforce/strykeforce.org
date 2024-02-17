# just manual: https://just.systems/man/en/

_default:
  @just --list

# bootstrap the development environment
bootstrap: venv pre-commit

# run the development server
run check="none":
    python {{ if check != "none" { "-X dev" } else { "" } }} manage.py runserver

# update CSS and download all JS dependencies
update: venv update-css update-alpine

# update CSS
update-css:
    tailwindcss -i website/static/css/base.css -o website/static/css/main.css

# download all JS dependencies
update-alpine:
    curl --no-progress-meter --location https://unpkg.com/alpinejs --output website/static/js/alpine.js

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
