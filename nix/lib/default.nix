{ flake, inputs, ... }:
let
  workspace = inputs.uv2nix.lib.workspace.loadWorkspace { workspaceRoot = ../../.; };

  overlay = workspace.mkPyprojectOverlay {
    sourcePreference = "wheel";
  };

  pythonSets =
    pkgs:
    let
      baseSet = pkgs.callPackage inputs.pyproject-nix.build.packages {
        python = pkgs.python312;
        stdenv = pkgs.stdenv.override {
          targetPlatform = pkgs.stdenv.targetPlatform // {
            # allow downloading of opencv-python wheel
            darwinSdkVersion = "15.2";
          };
        };
      };

      pillowHeifOverrides = import ./overrides/overrides-pillow-heif.nix { inherit pkgs; };
      psycopgOverrides = import ./overrides/overrides-psycopg.nix { inherit pkgs; };
      opencvOverrides = import ./overrides/overrides-opencv.nix { inherit pkgs; };
      tbaApiOverrides = import ./overrides/overrides-tba-api-v3client.nix { inherit pkgs; };
    in
    baseSet.overrideScope (
      inputs.nixpkgs.lib.composeManyExtensions [
        inputs.pyproject-build-systems.overlays.default
        overlay
        pillowHeifOverrides
        psycopgOverrides
        opencvOverrides
        tbaApiOverrides
      ]
    );
in
{

  inherit
    overlay
    pythonSets
    workspace
    ;

}
