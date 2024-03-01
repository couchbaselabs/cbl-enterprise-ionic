import { Database } from './database';

export class DatabaseLogging {
  constructor(private db: Database) {}

  setFileConfig(config: DatabaseFileLoggingConfiguration) {
    return this.db
      .getEngine()
      .Database_SetFileLoggingConfig(this.db.getName(), config);
  }
}

export interface DatabaseFileLoggingConfiguration {
  level: number;
  directory: string;
  maxRotateCount?: number;
  maxSize?: number;
  usePlaintext?: boolean;
}
