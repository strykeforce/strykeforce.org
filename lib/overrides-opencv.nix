{ pkgs }:
final: prev: {
  opencv-python = prev.opencv-python.overrideAttrs (old: {
    nativeBuildInputs =
      old.nativeBuildInputs or [ ]
      ++ (final.resolveBuildSystem {
        cmake = [ ];
        setuptools = [ ];
        scikit-build = [ ];
      });
  });
}
