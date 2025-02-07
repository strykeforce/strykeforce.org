{
  flake,
  pkgs,
  workspace,
}:
let
  inherit (pkgs.stdenv) isLinux mkDerivation;
in
final: prev: {
  #
  website = prev.website.overrideAttrs (old: {
    passthru = old.passthru // {
      tests =
        let
          venv = final.mkVirtualEnv "strykeforce-check-env" workspace.deps.default;
        in
        (old.tests or { })
        // {
          unittest = mkDerivation {
            name = "strykeforce-unittest";
            inherit (final.website) src;
            nativeBuildInputs = [ venv ];
            dontConfigure = true;
            dontInstall = true;

            buildPhase = ''
              runHook preBuild
              export DJANGO_SETTINGS_MODULE="website.settings.test"
              export TBA_READ_KEY=

              ${venv}/bin/python ./website/manage.py test website.events.tests > $out 2>&1
              runHook postBuild
            '';
          };
        }
        // pkgs.lib.optionalAttrs isLinux {
          nixos =
            let
              secrets = pkgs.writeText "strykeforce-test-secrets" ''
                SECRET_KEY="not-a-secret"
                TBA_READ_KEY=
                SENTRY_DSN=
                EMAIL_HOST_USER=
                EMAIL_HOST_PASSWORD=
              '';
            in
            pkgs.nixosTest {
              name = "strykeforce-nixos-test";

              nodes.machine =
                { ... }:
                {
                  imports = [
                    flake.nixosModules.default
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
                  machine.wait_until_succeeds("curl -sLf http://localhost:8000/static/2767/main.css")
                  machine.succeed("curl -sLf http://localhost:8000/static/2767/main.js")
                  html = machine.succeed("curl -sLf http://localhost:8000/admin/")
                  assert "<title>Sign in - Wagtail</title>" in html
                '';
            };
        };
    };
  });
}
