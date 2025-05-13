module.exports = {
   extends: ['prettier', 'plugin:@typescript-eslint/recommended'],
   plugins: ['@typescript-eslint', 'unused-imports'],
   rules: {
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/semi': 'warn',
      curly: 'warn',
      eqeqeq: 'warn',
      'no-throw-literal': 'warn',
      semi: 'off',
   },
   overrides: [
      {
         files: ['.ts', '.js', '.tsx'],
         rules: {
            'unused-imports/no-unused-imports-ts': 'error',
            '@typescript-eslint/no-var-requires': 0,
            '@typescript-eslint/no-non-null-assertion': 'off',
         },
      },
   ],
   ignorePatterns: ['**/out/**/*', '**/*.d.ts', '**/dist/**/*'],
};
