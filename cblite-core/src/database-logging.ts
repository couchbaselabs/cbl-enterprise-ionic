import { Database } from './database';

export interface DatabaseFileLoggingConfiguration {
  level: number;
  directory: string;
  maxRotateCount?: number;
  maxSize?: number;
  usePlaintext?: boolean;
}

export class DatabaseLogging {
  constructor(private db: Database) {}

  setFileConfig(config: DatabaseFileLoggingConfiguration) {
    return this.db
      .getEngine()
      .Database_SetFileLoggingConfig({
        name: this.db.getName(),
        config: config,
      });
  }
}
