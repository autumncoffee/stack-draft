{ pkgs ? import <nixpkgs> {} }:
let
  stdenv = pkgs.overrideCC pkgs.stdenv pkgs.clang_6;
in rec {
  enableDebugging = false; #true;

  back = stdenv.mkDerivation {
    name = "back";
    dontStrip = enableDebugging;
    IS_DEV = enableDebugging;
    srcs = [./src ./ac ./contrib];
    sourceRoot = "src";
    buildInputs = [
      pkgs.cmake
      pkgs.openssl_1_1
      pkgs.pcre-cpp
      pkgs.gperftools
      pkgs.abseil-cpp
    ];
    #cmakeFlags = [
      #"-DCMAKE_BUILD_TYPE=Debug"
    #];
    enableParallelBuilding = true;
  };
}
