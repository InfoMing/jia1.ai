import pluginVue from 'eslint-plugin-vue'

export default [
  { ignores: ['dist/**', 'public/**', 'node_modules/**', 'test-results/**', 'playwright-report/**'] },
  ...pluginVue.configs['flat/essential'],
  {
    files: ['src/**/*.{js,vue}', 'tests/**/*.js', '*.{config,conf}.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly', document: 'readonly', localStorage: 'readonly', sessionStorage: 'readonly',
        location: 'readonly', requestAnimationFrame: 'readonly', clearInterval: 'readonly', setInterval: 'readonly',
        console: 'readonly', process: 'readonly', __dirname: 'readonly'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error'
    }
  }
]

