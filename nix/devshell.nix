{
  flake,
  inputs,
  perSystem,
  pkgs,
  system,
}:
let
  pythonSet = flake.lib.pythonSets pkgs;
  inherit (inputs.self.checks.${system}) pre-commit;
in
pkgs.mkShell {
  packages =
    with pkgs;
    [
      pythonSet.python
      cachix
      just
      nil
      nix-output-monitor
      nixfmt-rfc-style
      nodejs
      postgresql.pg_config
      pre-commit
      tailwindcss
      perSystem.uv2nix.uv-bin
      perSystem.agenix.agenix
      watchman
    ]
    ++ pre-commit.enabledPackages;

  env = {
    UV_PYTHON_DOWNLOADS = "never";
  };

  shellHook = ''
    unset PYTHONPATH
    ${pre-commit.shellHook}
  '';
}
