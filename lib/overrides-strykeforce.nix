{
  # lib,
  # nixosModule,
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
        };
    };
  });
}
