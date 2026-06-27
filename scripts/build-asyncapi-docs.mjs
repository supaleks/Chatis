import { readFile, writeFile } from 'node:fs/promises'
import yaml from 'js-yaml'

const inputFile = new URL('../docs/api/asyncapi.yaml', import.meta.url)
const outputFile = new URL('../docs/api/asyncapi-data.js', import.meta.url)

const source = await readFile(inputFile, 'utf8')
const spec = yaml.load(source)
const serialized = JSON.stringify(spec, null, 2)

await writeFile(
	outputFile,
	`window.CHATIS_ASYNCAPI = ${serialized};\n`,
	'utf8'
)

console.log('AsyncAPI data generated: docs/api/asyncapi-data.js.')
