#!/bin/sh

# Define functions
includeCLIBin() {
  cp -rf src/bin build/bin
}

makeCLIBinExample() {
  mkdir build/bin/example
  cp -rf hooks build/bin/example/hooks
  cp -rf app.js build/bin/example/app.js
  cp .eslintrc build/bin/example/.eslintrc
  cp .gitignore build/bin/example/.gitignore
  cp .prettierrc build/bin/example/.prettierrc
  cp webpack.config.js build/bin/example/webpack.config.js
  sed -i '' 's=./src/==g' build/bin/example/app.js
  sed -i '' 's=../../src/==g' build/bin/example/hooks/requests/index.js
}

publishPackage() {
  cp -rf package.json build/package.json
  npm publish build
}

# Main
includeCLIBin
makeCLIBinExample
publishPackage
