// @ts-check
import globals from 'globals'
import eslint from '@eslint/js'
import ts_eslint from 'typescript-eslint'
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default ts_eslint.config(
  eslint.configs.recommended,
  ...ts_eslint.configs.strict,
  ...ts_eslint.configs.stylistic,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  prettierRecommended,
)
