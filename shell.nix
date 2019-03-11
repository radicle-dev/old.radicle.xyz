{ pkgs ? import <nixpkgs> {}
}:

with pkgs;

let pythonpkgs = python3.withPackages (ps: with ps; [ pygments rst2html5 ]);

in stdenv.mkDerivation {
  name = "radicle.xyz";
  buildInputs = [ hugo pythonpkgs ];
}
