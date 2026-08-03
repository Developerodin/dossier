import * as migration_20260803_073159_initial from './20260803_073159_initial';

export const migrations = [
  {
    up: migration_20260803_073159_initial.up,
    down: migration_20260803_073159_initial.down,
    name: '20260803_073159_initial'
  },
];
