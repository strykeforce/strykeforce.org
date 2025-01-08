{
  pkgs,
  static,
  venv,
}:
pkgs.writeShellApplication {
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
      DJANGO_DATABASE_URL=postgres:///strykeforce \
      SECRET_KEY=not-secret \
      STATIC_ROOT=${static} \
      TBA_READ_KEY="$TBA_READ_KEY" \
      ${venv}/bin/strykeforce-manage "$@"
  '';
}
