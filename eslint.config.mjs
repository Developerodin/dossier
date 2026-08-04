import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const softenReactHooks = (configs) =>
  configs.map((config) => {
    if (!config.rules) return config
    const rules = { ...config.rules }
    let changed = false
    for (const rule of [
      'react-hooks/set-state-in-effect',
      'react-hooks/refs',
      'react-hooks/static-components',
    ]) {
      if (rule in rules) {
        rules[rule] = 'warn'
        changed = true
      }
    }
    return changed ? { ...config, rules } : config
  })

const eslintConfig = [
  ...softenReactHooks(nextVitals),
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    ignores: ['.next/', 'src/payload-types.ts', 'src/payload-generated-schema.ts'],
  },
]

export default eslintConfig
