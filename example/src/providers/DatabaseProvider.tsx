import React, { useState, ReactNode } from 'react';
import { Database } from 'cblite-core';
import DatabaseContext from './DatabaseContext';
import { DatabaseContextType } from './DatabaseContextType';
import { CapacitorEngine } from 'cblite-ionic';

type DatabaseProviderProps = {
  children: ReactNode;
};

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {

  const [databases, setDatabases] = useState<Record<string, Database>>({});
  const value: DatabaseContextType = { databases, setDatabases };
  const engine = new CapacitorEngine();

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider;
