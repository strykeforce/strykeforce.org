{
  pkgs,
  flake,
  system,
  ...
}:
let
  inherit (flake.packages.${system}) static venv;
  inherit (pkgs) writeShellApplication;
in
writeShellApplication {
  name = "strykeforce-manage";
  text = ''
    if [ "$UID" -ne 0 ]; then
        echo "error: run this command as root."
        exit 1
    fi

    # shellcheck source=/dev/null
    source /run/agenix/stryker_website_secrets

    sudo -u strykeforce env \
      DJANGO_SETTINGS_MODULE=website.settings.production \
      SECRET_KEY=not-secret \
      STATIC_ROOT=${static} \
      EMAIL_HOST_USER="$EMAIL_HOST_USER" \
      EMAIL_HOST_PASSWORD="$EMAIL_HOST_PASSWORD" \
      TBA_READ_KEY="$TBA_READ_KEY" \
      ${venv}/bin/strykeforce-manage "$@"
  '';
}
