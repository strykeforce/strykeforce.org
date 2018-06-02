module.exports = {
  extends: 'airbnb',
  rules: {
    semi: 0,
    'react/jsx-filename-extension': 0,
    'import/no-extraneous-dependencies': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'react/prop-types': [1, { ignore: ['children'] }],
  },
  env: {
    browser: true,
  },
}
