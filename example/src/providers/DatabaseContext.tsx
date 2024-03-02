import React from 'react';
import { Database } from 'couchbase-lite-ee-ionic';
import { DatabaseContextType } from './DatabaseContextType';

const DatabaseContext = React.createContext<DatabaseContextType | undefined>(undefined);

export default DatabaseContext;