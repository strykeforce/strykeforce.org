{
  flake,
  perSystem,
  pkgs,
}:
pkgs.mkShell {
  packages = with pkgs; [
    (flake.lib.python pkgs)
    cachix
    just
    nil
    nix-output-monitor
    nixfmt-rfc-style
    nodejs
    postgresql.dev
    pre-commit
    tailwindcss
    perSystem.uv2nix.uv-bin
    watchman
  ];

  env = {
    UV_PYTHON_DOWNLOADS = "never";
  };

  shellHook = ''
    unset PYTHONPATH
  '';
}
