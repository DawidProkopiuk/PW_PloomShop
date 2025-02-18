// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
   eslint.configs.recommended,
   ...tseslint.configs.recommended,
   {
      languageOptions: {
         parserOptions: {
         project: true,
         tsconfigRootDir: ".",
         },
      },
      // enable linting rules beneficial for Playwright projects
      rules: {
         "@typescript-eslint/no-floating-promises": "error",
         "@typescript-eslint/await-thenable": "error",
      },
   }
);