import { 
  DatabaseArgs,
  ICoreEngine,
 } from 'cblite-core';

export interface PluginConfigureArgs {
  config: any;
}

export interface QueryExecuteArgs extends DatabaseArgs {
  query: {[key: string]: any};
}

export interface IonicCouchbaseLitePlugin extends ICoreEngine {
  //Plugin Configuration
  Plugin_Configure(args: PluginConfigureArgs)
    : Promise<void>;

  //Query Builder
  Query_Execute(args: QueryExecuteArgs)
    : Promise<{ id: string; }>;
}
