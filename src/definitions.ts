import { PluginCallback, PluginListenerHandle } from '@capacitor/core';
import {
  ConcurrencyControl,
  DatabaseConfiguration,
  Dictionary,
  Document,
  ReplicatorConfiguration,
  Result,
} from './couchbase-lite';
import { DatabaseFileLoggingConfiguration } from './couchbase-lite/database-logging';


//TODO remove these from here and use the ones from cblite-core
export interface PluginConfigureArgs {
  config: any;
}

export interface DatabaseArgs {
  name: string;
}

export interface DatabaseOpenArgs extends DatabaseArgs {
  config: DatabaseConfiguration;
}

export interface DatabaseSaveArgs extends DatabaseArgs {
  id: string;
  document: Dictionary;
}

export interface DatabaseCopyArgs extends DatabaseArgs {
  path: string;
  newName: string;
  config: DatabaseConfiguration;
}

export interface DatabaseCreateIndexArgs extends DatabaseArgs {
  indexName: string;
  index: any;
}

export interface DatabaseDeleteIndex extends DatabaseArgs {
  indexName: string;
}

export interface DatabaseCreateIndexArgs extends DatabaseArgs {
  indexName: string;
  index: any;
}

export interface DatabaseDeleteIndexArgs extends DatabaseArgs {
  indexName: string;
}

export interface DatabaseExistsArgs extends DatabaseArgs {
  existsName: string;
  directory: string;
}

export interface DatabasePurgeDocumentArgs extends DatabaseArgs {
  docId: string;
}

export interface DatabaseDeleteDocumentArgs extends DatabaseArgs {
  docId: string;
  document: Dictionary;
  concurrencyControl: ConcurrencyControl;
}

export interface DatabaseGetDocumentArgs extends DatabaseArgs {
  docId: string;
}

export interface DatabaseSetLogLevelArgs {
  domain: string;
  logLevel: number;
}

export interface DatabaseSetFileLoggingConfigArgs extends DatabaseArgs {
  config: DatabaseFileLoggingConfiguration;
}

export interface DocumentGetBlobContentArgs extends DatabaseArgs {
  documentId: string;
  key: string;
}

export interface QueryExecuteArgs extends DatabaseArgs {
  query: any;
  columnNames: { [name:string]: any };
}

export interface ResultSetNextArgs extends DatabaseArgs {
  resultSetId: string;
}

export interface ResultSetNextBatchArgs extends DatabaseArgs {
  resultSetId: string;
}

export interface ResultSetAllResultsArgs extends DatabaseArgs {
  resultSetId: string;
}

export interface ResultSetAllResultsArgs extends DatabaseArgs {
  resultSetId: string;
}

export interface ResultSetCleanupArgs extends DatabaseArgs {
  resultSetId: string;
}

export interface ResultSetCleanupArgs extends DatabaseArgs {
  resultSetId: string;
}

export interface ReplicatorCreateArgs extends DatabaseArgs {
  config: any;
}

export interface ReplicatorArgs {
  replicatorId: string;
}

export interface IonicCouchbaseLitePlugin {
  //Plugin Configuration
  Plugin_Configure(args: PluginConfigureArgs): Promise<void>;

  //File System - used for copy and opening database
  File_GetDefaultPath(): Promise<{ path: string }>;

  //Database top level functions
  Database_Open(args: DatabaseOpenArgs): Promise<void>;
  Database_GetPath(args: DatabaseArgs): Promise<{ path: string }>;
  Database_Copy(args: DatabaseCopyArgs): Promise<void>;
  Database_Exists(args: DatabaseExistsArgs): Promise<{ exists: boolean }>;
  Database_Close(args: DatabaseArgs): Promise<void>;
  Database_Delete(args: DatabaseArgs): Promise<void>;
  Database_AddChangeListener( args: DatabaseArgs, cb: PluginCallback,): Promise<PluginListenerHandle>;

  //Database maintenance
  Database_Compact(args: DatabaseArgs): Promise<void>;

  //Database logging
  Database_SetLogLevel(args: DatabaseSetLogLevelArgs): Promise<void>;
  Database_SetFileLoggingConfig(args: DatabaseSetFileLoggingConfigArgs,): Promise<void>;

  //Database Indexing 
  Database_CreateIndex(args: DatabaseCreateIndexArgs): Promise<void>;
  Database_DeleteIndex(args: DatabaseDeleteIndexArgs): Promise<void>;
  Database_GetIndexes( args: DatabaseArgs,): Promise<{ indexes: string[]; }>;

  //Database - Documents
  Database_Save(args: DatabaseSaveArgs): Promise<{ _id: string }>;
  Database_GetCount( args: DatabaseArgs,): Promise<{ count: number; }>;
  Database_PurgeDocument(args: DatabasePurgeDocumentArgs): Promise<void>;
  Database_DeleteDocument(args: DatabaseDeleteDocumentArgs): Promise<void>;
  Database_GetDocument( args: DatabaseGetDocumentArgs,): Promise<{ document: Document; }>;

  //Blobs
  Document_GetBlobContent(args: DocumentGetBlobContentArgs,): Promise<{ data: any; }>;

  //Query Builder
  Query_Execute(args: QueryExecuteArgs,): Promise<{ id: string; }>;
  ResultSet_Next(args: ResultSetNextArgs,): Promise<{ result: Result; }>;
  ResultSet_NextBatch(args: ResultSetNextBatchArgs,): Promise<{ results: Result[]; }>;
  ResultSet_AllResults(args: ResultSetAllResultsArgs, callback: PluginCallback,): Promise<PluginListenerHandle>;
  ResultSet_Cleanup(args: ResultSetCleanupArgs): Promise<void>;

  //Replicator
  Replicator_Create( args: ReplicatorCreateArgs,): Promise<{ replicatorId: string }>;
  Replicator_Start(args: ReplicatorArgs): Promise<void>;
  Replicator_Restart(args: ReplicatorArgs): Promise<void>;
  Replicator_AddChangeListener( args: ReplicatorArgs, cb: PluginCallback,): Promise<PluginListenerHandle>;
  Replicator_AddDocumentListener( args: ReplicatorArgs, cb: PluginCallback,): Promise<PluginListenerHandle>;
  Replicator_Stop(args: ReplicatorArgs): Promise<void>;
  Replicator_ResetCheckpoint(args: ReplicatorArgs): Promise<void>;
  Replicator_GetStatus(args: ReplicatorArgs): Promise<void>;
  Replicator_Cleanup(args: ReplicatorArgs): Promise<void>;
}
