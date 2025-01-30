{
  pkgs,
  pythonSet,
  venv,
}:
let
  baseCss = "website/static/2767/base.css";

  djangoStaticDeps = pkgs.buildNpmPackage {
    name = "django-static-deps";
    src = ../.;
    npmDepsHash = "sha256-K7GLUG25KdvTT5gqounSi3U0UJonw9gPEuHUF4pP8os=";
    dontNpmBuild = true;

    patchPhase = ''
      runHook prePatch
      runHook postPatch
    '';

    buildPhase = ''
      runHook preBuild
      npx @tailwindcss/cli --minify --input=${baseCss} --output=$out/2767/main.css
      npx esbuild --bundle --minify --outfile=$out/2767/main.js website/static/2767/base.js
      runHook postBuild
    '';

    installPhase = ''
      runHook postInstall
    '';
  };
  inherit (pkgs.stdenv) mkDerivation;
in
mkDerivation {
  pname = "strykeforce-static";
  inherit (pythonSet.website) version;
  nativeBuildInputs = [ venv ];

  dontUnpack = true;
  dontConfigure = true;
  dontBuild = true;

  installPhase = ''
    export DJANGO_SETTINGS_MODULE=website.settings.production
    export DJANGO_STATICFILES_DIR="${djangoStaticDeps}"
    export SECRET_KEY=
    export STATIC_ROOT=$out
    export TBA_READ_KEY=
    export EMAIL_HOST_USER=
    export EMAIL_HOST_PASSWORD=
    mkdir -p $out
    ${venv}/bin/strykeforce-manage collectstatic --no-input --ignore="2767/base.*"
  '';

}
