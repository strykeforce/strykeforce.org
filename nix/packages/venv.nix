{
  flake,
  pkgs,
  perSystem,
  ...
}:
let
  pythonSet = flake.lib.pythonSets pkgs;
  workspace = flake.lib.workspace;
in
pythonSet.mkVirtualEnv "styrkeforce-env" workspace.deps.default
// {
  passthru.tests = {
    unit-tests =
      let
        inherit (perSystem.self) venv;
      in
      pkgs.stdenvNoCC.mkDerivation {
        name = "strykeforce-unittest";
        src = ../../.;
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
}
