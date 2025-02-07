{ flake, pkgs, ... }:
let
  pythonSet = flake.lib.pythonSets pkgs;
  workspace = flake.lib.workspace;
in
pythonSet.mkVirtualEnv "styrkeforce-env" workspace.deps.default
