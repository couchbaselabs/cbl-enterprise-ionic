import { 
  ResultSet,
  Result,
  Database,
  DocumentResult,
  EngineLocator,
  DatabaseOpenArgs,
  DatabaseSaveArgs,
  DatabaseAddChangeListenerArgs,
  DatabaseArgs,
  DatabaseCopyArgs,
  DatabaseCreateIndexArgs,
  DatabaseDeleteIndexArgs,
  DatabaseExistsArgs,
  DatabasePurgeDocumentArgs,
  DatabaseDeleteDocumentArgs,
  DatabaseGetDocumentArgs,
  DatabaseSetLogLevelArgs,
  DatabaseSetFileLoggingConfigArgs,
  DocumentGetBlobContentArgs,
  EngineQueryExecuteArgs,
  ResultSetNextArgs,
  ResultSetNextBatchArgs,
  ResultSetAllResultsArgs,
  ResultSetCleanupArgs,
  ReplicatorCreateArgs,
  ReplicatorArgs,
  ReplicatorChangeListenerArgs,
} from 'cblite-core';

import { IonicCouchbaseLite } from '../ionic-couchbase-lite';
import { IonicCouchbaseLitePlugin, QueryExecuteArgs } from '../definitions';

import { PluginListenerHandle } from '@capacitor/core';

export interface EngineDatabaseSaveResult {
	_id: string;
}
  
export interface EngineReplicatorStartResult {
	replicatorId: string;
}

export class CapacitorEngine implements IonicCouchbaseLitePlugin {

  constructor(config: any = {}) {
    this.Plugin_Configure(config);
    EngineLocator.registerEngine(EngineLocator.key, this);
    
  }

  async Plugin_Configure(config: any)
    : Promise<void> {
    return IonicCouchbaseLite.Plugin_Configure({
      config,
    });
  }

  File_GetDefaultPath()
    : Promise<{ path: string }> { 
    return IonicCouchbaseLite.File_GetDefaultPath();
  }

  async Database_Open(args: DatabaseOpenArgs) 
    : Promise<void> {
    return IonicCouchbaseLite
      .Database_Open(args);
  }

  async Database_Save(args: DatabaseSaveArgs)
    : Promise<EngineDatabaseSaveResult> {
    return IonicCouchbaseLite.Database_Save(args);
  }

  Database_AddChangeListener(
    args: DatabaseAddChangeListenerArgs
  ): Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.Database_AddChangeListener(args);
  }

  async Database_GetCount(args: DatabaseArgs)
    : Promise<{ count: number }> {
    return IonicCouchbaseLite.Database_GetCount(args
    );
  }

  async Database_GetPath(args: DatabaseArgs)
    : Promise<{ path: string }> {
    return IonicCouchbaseLite.Database_GetPath(args);
  }

  async  Database_Copy(args: DatabaseCopyArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Database_Copy(args);
  }

  async Database_CreateIndex(args: DatabaseCreateIndexArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Database_CreateIndex(args);
  }

  async Database_DeleteIndex(args: DatabaseDeleteIndexArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Database_DeleteIndex(args);
  }

  async Database_GetIndexes(args: DatabaseArgs)
    : Promise<{ indexes: string[] }> {
    return IonicCouchbaseLite.Database_GetIndexes(args);
  }

  async Database_Exists(args: DatabaseExistsArgs)
    : Promise<{ exists: boolean }> {
    return IonicCouchbaseLite.Database_Exists(args);
  }

  async Database_Close(args: DatabaseArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Database_Close(args);
  }

  async Database_Compact(args: DatabaseArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Database_Compact(args);
  }

  async Database_Delete(args: DatabaseArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Database_Delete(args);
  }

  async Database_PurgeDocument(args: DatabasePurgeDocumentArgs)
   : Promise<void> {
    return IonicCouchbaseLite.Database_PurgeDocument(args);
  }

  async Database_DeleteDocument(args: DatabaseDeleteDocumentArgs) 
    : Promise<void> {
    return IonicCouchbaseLite.Database_DeleteDocument(args);
  }

  async Database_GetDocument(args : DatabaseGetDocumentArgs)
    : Promise<DocumentResult> {
    return IonicCouchbaseLite.Database_GetDocument(args);
  }

  async Database_SetLogLevel(args: DatabaseSetLogLevelArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Database_SetLogLevel(args);
  }

  async Database_SetFileLoggingConfig(args: DatabaseSetFileLoggingConfigArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Database_SetFileLoggingConfig(args);
  }

  async Document_GetBlobContent(args: DocumentGetBlobContentArgs): Promise<ArrayBuffer> {
    const data = await IonicCouchbaseLite.Document_GetBlobContent(args);
    return new Uint8Array(data).buffer;
  }

  async Engine_Query_Execute(args: EngineQueryExecuteArgs)
  : Promise<ResultSet> {
  args.query.check();
  let queryArgs = {
      name: args.name, 
      query: args.query.toJson(),
      columnNames: args.query.getColumnNames()
    };
  const ret = await this.Query_Execute(queryArgs);
  return new ResultSet(
    args.query, 
    ret.id, 
    args.query.getColumnNames());
}

  async Query_Execute(args: QueryExecuteArgs)
    : Promise<{ id: string; }> {
    return await IonicCouchbaseLite.Query_Execute({
      name: args.name,
      query: args.query,
      columnNames: args.columnNames,
    });
  }

  async ResultSet_Next(args: ResultSetNextArgs): Promise<{ result: Result }> {
    return IonicCouchbaseLite.ResultSet_Next(args);
  }

  async ResultSet_NextBatch( args: ResultSetNextBatchArgs)
    : Promise<{ results: Result[] }> {
    return IonicCouchbaseLite.ResultSet_NextBatch(args);
  }

  ResultSet_AllResults(
    args: ResultSetAllResultsArgs,
    cb: (data: any, err: any) => void)
    : Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.ResultSet_AllResults(args, cb);
  }

  async ResultSet_Cleanup(args: ResultSetCleanupArgs)
    : Promise<void> {
    return IonicCouchbaseLite.ResultSet_Cleanup(args);
  }

  async Replicator_Create(args: ReplicatorCreateArgs)
    : Promise<EngineReplicatorStartResult> {
    return IonicCouchbaseLite.Replicator_Create(args);
  }

  async Replicator_Start(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.Replicator_Start(args);
  }

  async Replicator_Restart(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.Replicator_Restart(args);
  }

  Replicator_AddChangeListener(
     args: ReplicatorChangeListenerArgs)
    : Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.Replicator_AddChangeListener(args);
  }

  Replicator_AddDocumentListener(
    args: ReplicatorChangeListenerArgs)
    : Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.Replicator_AddDocumentListener(
      args);
  }

  async Replicator_Stop(args: ReplicatorArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Replicator_Stop(args);
  }

  async Replicator_ResetCheckpoint(args: ReplicatorArgs)
    : Promise<void> {
    return IonicCouchbaseLite.Replicator_ResetCheckpoint(args);
  }

  async Replicator_GetStatus(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.Replicator_GetStatus(args);
  }

  async Replicator_Cleanup(args: ReplicatorArgs): Promise<void> {
    return IonicCouchbaseLite.Replicator_Cleanup(args);
  }
}