{
  inputs,
  flake,
  pkgs,
  ...
}:
let
  inherit (pkgs) lib;

  secrets = pkgs.writeText "strykeforce-test-secrets" ''
    SECRET_KEY="not-a-secret"
    TBA_READ_KEY=
    SENTRY_DSN=
    EMAIL_HOST_USER=
    EMAIL_HOST_PASSWORD=
  '';
in
pkgs.nixosTest {
  name = "strykeforce-integration-tests";

  nodes.machine =
    { pkgs, ... }:
    {
      imports = [
        inputs.srvos.nixosModules.server
        flake.modules.nixos.strykeforce-website
      ];

      strykeforce.services.website = {
        enable = true;
        allowedHosts = "localhost";
        ssl = false;
        secrets = [ secrets ];
      };

      services.postgresql = {
        enable = true;
        package = pkgs.postgresql_16;
        ensureDatabases = [ "strykeforce" ];
        ensureUsers = [
          {
            name = "strykeforce";
            ensureDBOwnership = true;
          }
        ];
      };

      system.stateVersion = "24.11";
    };

  testScript =
    { nodes, ... }:
    ''
      # wait for service
      machine.wait_for_unit("strykeforce-website.service")
      with subtest("check static files"):
        machine.wait_until_succeeds("curl -sLf http://localhost:8000/static/2767/main.css")
        machine.succeed("curl -sLf http://localhost:8000/static/2767/main.js")

      with subtest("check for login page"):
        html = machine.succeed("curl -sLf http://localhost:8000/admin/")
        assert "<title>Sign in - Wagtail</title>" in html
    '';
}
