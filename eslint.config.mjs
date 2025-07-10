import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    '@typescript-eslint/recommended',
    'prettier'
  ),
  {
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'react/jsx-key': 'error',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
    },
    ignores: ['node_modules/', '.next/', '.vercel/', 'out/', 'build/', 'dist/'],
  },
];

export default eslintConfig;
