import * as migration_20260803_073159_initial from './20260803_073159_initial';
import * as migration_20260804_185454_footer_newsletter_form from './20260804_185454_footer_newsletter_form';
import * as migration_20260811_080000_newspark_schema from './20260811_080000_newspark_schema';

export const migrations = [
  {
    up: migration_20260803_073159_initial.up,
    down: migration_20260803_073159_initial.down,
    name: '20260803_073159_initial',
  },
  {
    up: migration_20260804_185454_footer_newsletter_form.up,
    down: migration_20260804_185454_footer_newsletter_form.down,
    name: '20260804_185454_footer_newsletter_form',
  },
  {
    up: migration_20260811_080000_newspark_schema.up,
    down: migration_20260811_080000_newspark_schema.down,
    name: '20260811_080000_newspark_schema',
  },
];
