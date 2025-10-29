import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-plugin-prettier'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/.DS_Store',
    '**/docs',
    '**/*.local',
    'node_modules/*',
    '**/.next',
    '**/next-env.d.ts'
  ]),
  {
    extends: [
      ...compat.extends('eslint:recommended'),
      ...compat.extends('plugin:react/recommended'),
      ...compat.extends('plugin:prettier/recommended'),
      ...nextCoreWebVitals
    ],
    plugins: {
      prettier
    },
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: '19'
      }
    },
    rules: {
      'prettier/prettier': [
        'off',
        {},
        {
          usePrettierrc: true
        }
      ],
      'no-undef': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'jsx-a11y/accessible-emoji': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',

      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton']
        }
      ],
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/alt-text': 'off'
    },
    ignores: [
      'node_modules',
      '.DS_Store',
      'docs',
      '*.local',
      'node_modules/*',
      '.next',
      'next-env.d.ts'
    ]
  }
])
