{ inputs, pkgs, ... }:
inputs.treefmt-nix.lib.mkWrapper pkgs {
  projectRootFile = "flake.nix";
  programs.fish_indent.enable = true;

  programs.mdformat.enable = true;
  programs.mdformat.settings.number = true;

  programs.nixfmt.enable = true;
  programs.stylua.enable = true;
  programs.yamlfmt.enable = true;

  settings = {
    global.excludes = [ "*.{age,gif,png,svg,env,envrc,gitignore,tmTheme,sublime-syntax,theme}" ];
  };
}
