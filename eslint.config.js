import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'release', 'node_modules'] },

  // Base TypeScript config
  ...tseslint.configs.recommended,

  // React Hooks rules
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // Browser + Chrome Extension globals
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
        chrome: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Disable ESLint rules that conflict with Prettier (always last)
  prettierConfig,
)
