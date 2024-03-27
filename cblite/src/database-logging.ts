import { Database } from './database';

// Couchbase Mobile Docs
//https://docs.couchbase.com/couchbase-lite/current/swift/troubleshooting-logs.html#lbl-file-logs

export interface DatabaseFileLoggingConfiguration {
  level: number;
  directory: string;
  maxRotateCount?: number;
  maxSize?: number;
  usePlaintext?: boolean;
}

export class DatabaseLogging {
  constructor(private db: Database) {}

  setFileConfig(config: DatabaseFileLoggingConfiguration):Promise<void> {
    return this.db
      .getEngine()
      .Database_SetFileLoggingConfig({
        name: this.db.getName(),
        config: config,
      });
  }
}
