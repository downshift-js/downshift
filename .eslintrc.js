module.exports = {
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
	parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  extends: ['./node_modules/kcd-scripts/eslint.js'],
  rules: {
    eqeqeq: 'off',
    'import/no-useless-path-segments': 'off',
    'import/no-unassigned-import': 'off',
    'max-lines': 'off',
    'max-lines-per-function': 'off',
    'no-eq-null': 'off',
    'react/jsx-indent': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/autocomplete-valid': 'off',
    complexity: ['error', 12],

    'testing-library/prefer-user-event': 'off',
    'testing-library/no-node-access': 'off',
    'testing-library/no-container': 'off',
    'testing-library/render-result-naming-convention': 'off',

    '@typescript-eslint/no-unused-vars': 'off',
  },
  overrides: [
    {
      files: ['cypress/**/*.js'],
      rules: {
        'testing-library/prefer-screen-queries': 'off',
        'testing-library/await-async-query': 'off',
      },
    },
  ],
}
