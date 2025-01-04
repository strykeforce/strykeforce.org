{ pkgs }:
final: prev: {
  pillow-heif = prev.pillow-heif.overrideAttrs (old: {
    nativeBuildInputs =
      old.nativeBuildInputs or [ ]
      ++ (final.resolveBuildSystem {
        setuptools = [ ];
      })
      ++ [ pkgs.pkg-config ];
    buildInputs = old.buildInputs or [ ] ++ [ pkgs.libheif ];
    # clang-16: error: argument unused during compilation: '-fno-strict-overflow'
    NIX_CFLAGS_COMPILE = pkgs.lib.optionalString pkgs.stdenv.cc.isClang "-Wno-unused-command-line-argument";
  });
}
