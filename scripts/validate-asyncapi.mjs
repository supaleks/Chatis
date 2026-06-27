import { DiagnosticSeverity, Parser, fromFile } from '@asyncapi/parser'

const [, , filePath = 'docs/api/asyncapi.yaml'] = process.argv

const parser = new Parser()
const diagnostics = await fromFile(parser, filePath).validate()
const errors = diagnostics.filter(
	diagnostic => diagnostic.severity === DiagnosticSeverity.Error
)

if (diagnostics.length > 0) {
	for (const diagnostic of diagnostics) {
		const location = diagnostic.location?.jsonPointer ?? '<document>'
		console.log(`${DiagnosticSeverity[diagnostic.severity]} ${location}: ${diagnostic.message}`)
	}
}

if (errors.length > 0) {
	process.exitCode = 1
} else {
	console.log(`${filePath} is valid.`)
}
