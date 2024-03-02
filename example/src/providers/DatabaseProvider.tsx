import React, { useState, ReactNode } from 'react';
import { Database } from 'couchbase-lite-ee-ionic';
import DatabaseContext from './DatabaseContext';
import { DatabaseContextType } from './DatabaseContextType';

type DatabaseProviderProps = {
  children: ReactNode;
};

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [databases, setDatabases] = useState<Record<string, Database>>({});

  const value: DatabaseContextType = { databases, setDatabases };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider;
