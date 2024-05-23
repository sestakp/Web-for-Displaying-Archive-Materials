module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
    'plugin:react/recommended',
  ],
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        '.eslintrc.{js,cjs}',
      ],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'quotes': 'warn',
    'max-len': [
      'error',
      {
        'code': 100, // Maximum line length in characters
        'ignoreUrls': true, // Ignore URLs
        'ignoreStrings': true, // Ignore long strings
        'ignoreTemplateLiterals': true, // Ignore template literals
        'ignoreComments': true, // Ignore comments
        'ignoreRegExpLiterals': true, // Ignore regular expressions
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'indent': ['error', 2],
  },
};
