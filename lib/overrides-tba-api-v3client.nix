{ pkgs }:
final: prev: {
  tba-api-v3client = prev.tba-api-v3client.overrideAttrs (old: {
    nativeBuildInputs =
      old.nativeBuildInputs or [ ]
      ++ (final.resolveBuildSystem {
        setuptools = [ ];
      });
  });
}
