import { registerPlugin } from '@capacitor/core';

import type { IonicCouchbaseLitePlugin } from './definitions';

export * from './couchbase-lite/index';

const IonicCouchbaseLite = registerPlugin<IonicCouchbaseLitePlugin>(
  'IonicCouchbaseLite',
);

export * from './definitions';
export { IonicCouchbaseLite };
