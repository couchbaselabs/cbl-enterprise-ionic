import { Database } from 'cblite-core';
export type DatabaseContextType = {
	databases: Record<string, Database>;
	setDatabases: React.Dispatch<React.SetStateAction<Record<string, Database>>>;
  };