import { registerPlugin } from '@capacitor/core';
import type { IonicCouchbaseLitePlugin } from './definitions';
const IonicCouchbaseLite = registerPlugin<IonicCouchbaseLitePlugin>(
	'IonicCouchbaseLite',
  );
export { IonicCouchbaseLite };