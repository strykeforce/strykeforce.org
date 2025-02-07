{ pkgs }:
final: prev: {
  opencv-python = prev.opencv-python.overrideAttrs (old: {
    nativeBuildInputs =
      old.nativeBuildInputs or [ ]
      ++ (final.resolveBuildSystem {
        cmake = [ ];
        numpy = [ ];
        setuptools = [ ];
        scikit-build = [ ];
      });
  });
}
