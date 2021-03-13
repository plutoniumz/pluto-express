#!/bin/sh

# Define functions
includeCLIBin() {
  cp -rf src/bin build/bin
}

makeCLIBinExample() {
  mkdir build/bin/example
  cp -rf configs build/bin/example/configs
  cp -rf controllers build/bin/example/controllers
  cp -rf middlewares build/bin/example/middlewares
  cp -rf models build/bin/example/models
  cp -rf policies build/bin/example/policies
  cp -rf responses build/bin/example/responses
  cp -rf app.js build/bin/example/app.js
  cp .eslintrc build/bin/example/.eslintrc
  cp .gitignore build/bin/example/.gitignore
  cp .prettierrc build/bin/example/.prettierrc
  cp jest.config.json build/bin/example/jest.config.js
  cp webpack.config.js build/bin/example/webpack.config.js
  sed -i '' 's=./src/app=pluto-express=g' build/bin/example/app.js
}

includeDefaultFiles() {
  cp package.json build/package.json
  sed -i '' 's=src/app.js=app.js=g' build/package.json
}

setupForNewApplication() {
  makeCLIBinExample
  includeDefaultFiles
}

publishPackage() {
  npm publish build
}

# Main
includeCLIBin
setupForNewApplication
publishPackage
