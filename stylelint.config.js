export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-scss'],
  customSyntax: 'postcss-scss',
  rules: {
    'selector-class-pattern': /^[a-z][a-z0-9-]*(__[a-z0-9-]+)*(--[a-z0-9-]+)?$/,

    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'use',
          'include',
          'mixin'
        ]
      }
    ],

    'scss/dollar-variable-pattern': /^[_a-z][_a-z0-9-]*$/,
    'scss/at-mixin-pattern': /^[_a-z][_a-z0-9-]*$/,
    'scss/at-function-pattern': /^[_a-z][_a-z0-9-]*$/
  }
};
