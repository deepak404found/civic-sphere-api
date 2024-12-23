import fs from 'fs'
import path from 'path'
import { swaggerSpec } from './helpers/swagger'

const outputDir = path.join(__dirname, '..', 'build')
const outputFile = path.join(outputDir, 'openapi.json')

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
}

fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2))
console.log(`OpenAPI JSON written to ${outputFile}`)
