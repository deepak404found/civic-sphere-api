echo "removing old files"
rm -rf build

pnpm run generate:docs

echo "Generating Typescript-Axios Package"
java -jar swagger-codegen-cli-3.0.56.jar generate -i build/openapi.json -l typescript-axios -o build/chips-mis-api -c npm-package-config.json

cp .npmrc build/chips-mis-api/.npmrc
cd build/chips-mis-api

echo "publishing @deepak404found/chips-mis-api"
pnpm install
npm publish
