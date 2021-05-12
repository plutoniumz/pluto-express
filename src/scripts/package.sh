#!/bin/sh

# Define functions
includeCLIBin() {
  cp -rf src/bin build/bin
}

publishPackage() {
  cp -rf package.json build/package.json
  npm publish build
}

# Main
includeCLIBin
publishPackage
