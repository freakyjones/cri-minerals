import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
    },
    rules: {
      'react/forbid-dom-props': ['error', { forbid: ['style'] }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../features/*', '../../../features/*'],
              message: 'Cross-feature imports are strictly forbidden by RULE 1.1. Use shared components or lib instead.'
            }
          ]
        }
      ]
    },
  },
)
