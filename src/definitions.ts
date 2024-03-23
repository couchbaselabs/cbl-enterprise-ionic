import { 
  DatabaseArgs,
  ICoreEngine,
 } from 'cblite';

import { PluginCallback, PluginListenerHandle } from '@capacitor/core';

export interface PluginConfigureArgs {
  config: any;
}

//generic token listeners for the ionic plugin
export interface ListenerToken {}

// ** assocation with the DatabaseChangeListener

export type DatabaseChangeListener = (change: DatabaseChange) => void;

export interface DatabaseChange {
  documentIDs: string[];
}

export interface QueryExecuteArgs extends DatabaseArgs {
  query: any;
  columnNames: { [name:string]: any };
}

export interface IonicCouchbaseLitePlugin extends ICoreEngine {
  //Plugin Configuration
  Plugin_Configure(args: PluginConfigureArgs)
    : Promise<void>;

  Database_AddChangeListener(
    args: DatabaseArgs, 
    cb: PluginCallback)
    : Promise<PluginListenerHandle>;

  //Query Builder
  Query_Execute(args: QueryExecuteArgs)
    : Promise<{ id: string; }>;
}
