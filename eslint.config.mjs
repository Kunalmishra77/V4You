import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      // CLAUDE.md rule 7: content lives in the CMS, not in JSX. This catches the
      // stray apostrophe or quote that would otherwise be a build failure.
      'react/no-unescaped-entities': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Last, so formatting rules never fight Prettier.
  prettier,

  // `scripts/tmp` is the throwaway verification scripts — browser probes written
  // to check one thing and then deleted. It is already gitignored; ignoring it
  // here too stops a scratch file with an unused variable failing the lint for
  // the whole project, which is a false signal about the code that ships.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    'scripts/tmp/**',
  ]),
])

export default eslintConfig
