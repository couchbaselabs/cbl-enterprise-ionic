import { Database } from 'couchbase-lite-ee-ionic';
export type DatabaseContextType = {
	databases: Record<string, Database>;
	setDatabases: React.Dispatch<React.SetStateAction<Record<string, Database>>>;
  };