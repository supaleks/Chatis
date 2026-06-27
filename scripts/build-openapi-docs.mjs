import { readFile, writeFile } from 'node:fs/promises'
import yaml from 'js-yaml'

const inputFile = new URL('../docs/api/openapi.yaml', import.meta.url)
const outputFile = new URL('../docs/api/openapi-data.js', import.meta.url)

const source = await readFile(inputFile, 'utf8')
const spec = yaml.load(source)
const serialized = JSON.stringify(spec, null, 2)

await writeFile(
	outputFile,
	`window.CHATIS_OPENAPI = ${serialized};\n`,
	'utf8'
)

console.log('OpenAPI data generated at docs/api/openapi-data.js.')
