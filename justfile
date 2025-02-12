# just manual: https://just.systems/man/en/

_default:
    @just --list

# bootstrap the development environment
bootstrap: pre-commit

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

# run django unit tests
test: (manage "test --keepdb")

_check_nixos:
    @if ! command -v nixos-rebuild &> /dev/null; then \
        echo "Not on NixOS, skipping deploy..."; \
        exit 1; \
    fi

_deploy_to host opts how: _check_nixos
    nixos-rebuild {{ opts }} --flake . --target-host root@{{ host }} {{ how }}

# deploy to staging server
stage how="switch": (_deploy_to "pallas" "" how)

# deploy to production server
deploy how="dry-activate": (_deploy_to "mercury" "--use-substitutes" how)

# push packages to cachix
push:
    nix build --json .#venv | jq -r '.[].outputs | to_entries[].value' | cachix push strykeforce
    nix build --json .#static | jq -r '.[].outputs | to_entries[].value' | cachix push strykeforce

# update npm dependencies to latest versions
npm-update:
    npm install tailwindcss@latest @tailwindcss/cli@latest @tailwindcss/forms@latest \
    @tailwindcss/aspect-ratio @tailwindcss/typography alpinejs@latest  esbuild@latest

# update CSS
update-css:
    npx @tailwindcss/cli --input=website/static/2767/base.css --output=website/static/2767/main.css

# update JS
update-js:
    npx esbuild --bundle --outfile=website/static/2767/main.js website/static/2767/base.js

# Watch CSS and JS for changes
watch: update-css
    npx @tailwindcss/cli --watch --input=website/static/2767/base.css --output=website/static/2767/main.css

# install pre-commit hooks
pre-commit:
    pre-commit install --install-hooks
