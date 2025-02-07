{ flake, inputs, ... }:
let
  workspace = inputs.uv2nix.lib.workspace.loadWorkspace { workspaceRoot = ../../.; };

  overlay = workspace.mkPyprojectOverlay {
    sourcePreference = "wheel";
  };

  python = pkgs: pkgs.python312;

  pythonSets =
    pkgs:
    let
      baseSet = pkgs.callPackage inputs.pyproject-nix.build.packages {
        python = python pkgs;
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
      strykeforceOverrides = import ./overrides/overrides-strykeforce.nix {
        inherit flake pkgs workspace;
      };
      tbaApiOverrides = import ./overrides/overrides-tba-api-v3client.nix { inherit pkgs; };
    in
    baseSet.overrideScope (
      inputs.nixpkgs.lib.composeManyExtensions [
        inputs.pyproject-build-systems.overlays.default
        overlay
        pillowHeifOverrides
        psycopgOverrides
        opencvOverrides
        strykeforceOverrides
        tbaApiOverrides
      ]
    );
in
{

  inherit
    overlay
    python
    pythonSets
    workspace
    ;

}
