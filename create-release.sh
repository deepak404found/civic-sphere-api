echo "removing old files"
rm -rf build

pnpm run generate:docs

echo "Generating Typescript-Axios Package"
java -jar swagger-codegen-cli-3.0.56.jar generate -i build/openapi.json -l typescript-axios -o build/civic-sphere-api -c npm-package-config.json

cp .npmrc build/civic-sphere-api/.npmrc
cd build/civic-sphere-api

echo "publishing @deepak404found/civic-sphere-api"
pnpm install
npm publish
