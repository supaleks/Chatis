import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
	globalIgnores(['dist']),

	// Общие правила проекта
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite
		],

		languageOptions: {
			globals: globals.browser
		},

		rules: {
			'react-refresh/only-export-components': [
				'error',
				{
					allowConstantExport: true
				}
			]
		}
	},

	// shadcn/ui генерирует компоненты, которые экспортируют
	// вспомогательные сущности (buttonVariants и т.п.).
	// Для них отключаем это правило.
	{
		files: ['src/shared/ui/**/*.{ts,tsx}'],
		rules: {
			'react-refresh/only-export-components': 'off'
		}
	}
])
