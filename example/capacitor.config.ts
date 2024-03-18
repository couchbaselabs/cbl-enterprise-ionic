import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'example',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  "plugins": {
    "couchbase-lite-ee-ionic": {}
  }
};

export default config;
