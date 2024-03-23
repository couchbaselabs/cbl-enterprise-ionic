import {
  AbstractIndex,
  ConcurrencyControl,
  DatabaseConfiguration,
  Dictionary,
  Document,
  Query,
  Result,
  ResultSet,
  Database,
  ReplicatorConfiguration,
} from './src';

import { DatabaseFileLoggingConfiguration } from './src/database-logging';

/* TODO MUST REMOVE THESE AND ABTRACT OUT OF HERE */
//=================================================//
export interface PluginListenerHandle {
  remove: () => Promise<void>;
}
//=================================================//

export interface EngineDatabaseSaveResult {
	_id: string;
}
  
export interface EngineReplicatorStartResult {
	replicatorId: string;
}

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
  concurrencyControl: ConcurrencyControl | null;
}

export interface DatabaseCopyArgs extends DatabaseArgs {
  path: string;
  newName: string;
  config: DatabaseConfiguration;
}

export interface DatabaseCreateIndexArgs extends DatabaseArgs {
  indexName: string;
  index: AbstractIndex;
}

export interface DatabaseDeleteIndex extends DatabaseArgs {
  indexName: string;
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

export interface DocumentResult {
  document: Document;
}

export interface EngineQueryExecuteArgs extends DatabaseArgs {
  query: Query;
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

export interface ResultSetCleanupArgs extends DatabaseArgs {
  resultSetId: string;
}

export interface ResultSetCleanupArgs extends DatabaseArgs {
  resultSetId: string;
}

export interface ReplicatorCreateArgs extends DatabaseArgs {
  config: ReplicatorConfiguration;
}

export interface ReplicatorArgs {
  replicatorId: string;
}

export interface ReplicatorChangeListenerArgs {
  replicatorId: string;
  callback: (data: any, err: any) => void;
}

export interface ICoreEngine {
  //File System - used for copy and opening database
  File_GetDefaultPath()
    : Promise<{ path: string }>;

  //Database top level functions
  Database_Open(args: DatabaseOpenArgs)
    : Promise<void>;
  Database_GetPath(args: DatabaseArgs)
    : Promise<{ path: string }>;
  Database_Copy(args: DatabaseCopyArgs)
    : Promise<void>;
  Database_Exists(args: DatabaseExistsArgs)
    : Promise<{ exists: boolean }>;
  Database_Close(args: DatabaseArgs)
    : Promise<void>;
  Database_Delete(args: DatabaseArgs)
    : Promise<void>;

  //Database maintenance
  Database_Compact(args: DatabaseArgs)
    : Promise<void>;

  //Database logging
  Database_SetLogLevel(args: DatabaseSetLogLevelArgs)
    : Promise<void>;
  Database_SetFileLoggingConfig(args: DatabaseSetFileLoggingConfigArgs)
    : Promise<void>;

  //Database Indexing 
  Database_CreateIndex(args: DatabaseCreateIndexArgs)
    : Promise<void>;
  Database_DeleteIndex(args: DatabaseDeleteIndexArgs)
    : Promise<void>;
  Database_GetIndexes(args: DatabaseArgs)
    : Promise<{ indexes: string[]; }>;

  //Database - Documents
  Database_Save(args: DatabaseSaveArgs)
    : Promise<{ _id: string }>;
  Database_GetCount(args: DatabaseArgs)
    : Promise<{ count: number; }>;
  Database_PurgeDocument(args: DatabasePurgeDocumentArgs)
    : Promise<void>;
  Database_DeleteDocument(args: DatabaseDeleteDocumentArgs) 
    : Promise<void>;
  Database_GetDocument(args: DatabaseGetDocumentArgs)
    : Promise<DocumentResult>;

  //Blobs
  Document_GetBlobContent(args: DocumentGetBlobContentArgs)
    : Promise< ArrayBuffer>;

  //Query Builder
  Engine_Query_Execute(args: EngineQueryExecuteArgs)
    : Promise<ResultSet>;
  ResultSet_Next(args: ResultSetNextArgs)
    : Promise<{ result: Result; }>;
  ResultSet_NextBatch(args: ResultSetNextBatchArgs)
    : Promise<{ results: Result[]; }>;
  ResultSet_Cleanup(args: ResultSetCleanupArgs)
    : Promise<void>;

  //Replicator
  Replicator_Create(args: ReplicatorCreateArgs)
    : Promise<{ replicatorId: string }>;
  Replicator_Start(args: ReplicatorArgs)
    : Promise<void>;
  Replicator_Restart(args: ReplicatorArgs)
    : Promise<void>;
  Replicator_Stop(args: ReplicatorArgs)
    : Promise<void>;
  Replicator_ResetCheckpoint(args: ReplicatorArgs)
    : Promise<void>;
  Replicator_GetStatus(args: ReplicatorArgs)
    : Promise<void>;
  Replicator_Cleanup(args: ReplicatorArgs)
    : Promise<void>;

  //change listeners
  ResultSet_AllResults(
    args: ResultSetAllResultsArgs,
    callback:(data: any, err: any) => void)
    : Promise<PluginListenerHandle>;


  Replicator_AddChangeListener(args: ReplicatorChangeListenerArgs)
    : Promise<PluginListenerHandle>;

  Replicator_AddDocumentListener(args: ReplicatorChangeListenerArgs)
    : Promise<PluginListenerHandle>;
}
