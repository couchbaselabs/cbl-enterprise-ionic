import React from 'react';
import { Database } from 'cblite-core';
import { DatabaseContextType } from './DatabaseContextType';

const DatabaseContext = React.createContext<DatabaseContextType | undefined>(undefined);

export default DatabaseContext;