{ pkgs ? import <nixpkgs> {} }:

with pkgs;

let
  inherit (lib) optional optionals;

  nodejs = nodejs_20;

in pkgs.mkShell {
  packages = with pkgs; [
    nodejs
  ];
}

