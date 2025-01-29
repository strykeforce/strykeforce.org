# just manual: https://just.systems/man/en/

_default:
  @just --list

# bootstrap the development environment
bootstrap: pre-commit

# open the project in Pycharm
edit:
  pycharm .

# run manage.py with command
manage command:
    uv run --no-sync website/manage.py {{ command }}

# create database migrations if needed
makemigrations: (manage "makemigrations")

# migrate the database
migrate: (manage "migrate")

# run the ipython repl
shell: (manage "shell")

# run the development server
run check="none":
    uv run python {{ if check != "none" { "-X dev" } else { "" } }} website/manage.py runserver

test: (manage "test --keepdb")

push:
    nix build --json .#venv | jq -r '.[].outputs | to_entries[].value' | cachix push strykeforce
    nix build --json .#static | jq -r '.[].outputs | to_entries[].value' | cachix push strykeforce
#
# update CSS
update-css:
    npx @tailwindcss/cli --input=website/static/css/base.css --output=website/static/css/main.css

# update JS
update-js:
    npx esbuild --bundle --outfile=puka/static/puka/main.js puka/static/puka/base.js

# Watch CSS and JS for changes
watch: update-css
    npx @tailwindcss/cli --watch --input=website/static/css/base.css --output=website/static/css/main.css

# install pre-commit hooks
pre-commit:
    pre-commit install --install-hooks
