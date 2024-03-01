import { MutableDocument } from '../mutable-document';
import { ConcurrencyControl } from '../concurrency-control';
import { DatabaseConfiguration } from '../database-configuration';
import { ResultSet } from '../result-set';
import { Result } from '../result';
import { Query } from '../query';
import { Document } from '../document';
import { ReplicatorConfiguration } from '../replicator-configuration';
import { AbstractIndex } from '../abstract-index';
import { DatabaseFileLoggingConfiguration } from '../database-logging';

import { IonicCouchbaseLite } from '../../index';
import { PluginListenerHandle } from '@capacitor/core';
import { EngineService, EngineDatabaseSaveResult, EngineReplicatorStartResult } from './engineService';


export class CapacitorEngine {
  engineService: EngineService;

  constructor(config: any = {}) {
    this.engineService = new EngineService();
    this.Plugin_Configure(config);
  }

  async Plugin_Configure(config: any): Promise<void> {
    return this.engineService.PluginConfigure({
      config,
    });
  }

  async Database_Open(
    name: string,
    config: DatabaseConfiguration,
  ): Promise<void> {
    return this.engineService.DatabaseOpen(
      name,
      config,
    );
  }

  async Database_Save(
    databaseName: string,
    document: MutableDocument,
    concurrencyControl: ConcurrencyControl,
  ): Promise<EngineDatabaseSaveResult> {
    var args = {
      name: databaseName,
      id: document.getId(),
      document: document.toDictionary(),
    };
    if (concurrencyControl) {
      args['concurrencyControl'] = concurrencyControl;
    }
    return IonicCouchbaseLite.Database_Save(args);
  }

  Database_AddChangeListener(
    databaseName: string,
    cb: (data: any, err: any) => void,
  ): Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.Database_AddChangeListener(
      {
        name: databaseName,
      },
      cb,
    );
  }

  async Database_GetCount(databaseName: string): Promise<{ count: number }> {
    return IonicCouchbaseLite.Database_GetCount({
      name: databaseName,
    });
  }

  async Database_GetPath(databaseName: string): Promise<{ path: string }> {
    return IonicCouchbaseLite.Database_GetPath({
      name: databaseName,
    });
  }

  async Database_Copy(
    databaseName: string,
    path: string,
    name: string,
    config: DatabaseConfiguration,
  ): Promise<void> {
    //this\.log('Database_Copy');
    return IonicCouchbaseLite.Database_Copy({
      name: databaseName,
      path,
      newName: name,
      config,
    });
  }

  async Database_CreateIndex(
    databaseName: string,
    name: string,
    index: AbstractIndex,
  ): Promise<void> {
    return IonicCouchbaseLite.Database_CreateIndex({
      name: databaseName,
      indexName: name,
      index: index.toJson(),
    });
  }

  async Database_DeleteIndex(
    databaseName: string,
    name: string,
  ): Promise<void> {
    return IonicCouchbaseLite.Database_DeleteIndex({
      name: databaseName,
      indexName: name,
    });
  }

  async Database_GetIndexes(
    databaseName: string,
  ): Promise<{ indexes: string[] }> {
    return IonicCouchbaseLite.Database_GetIndexes({
      name: databaseName,
    });
  }

  async Database_Exists(
    databaseName: string,
    name: string,
    directory: string,
  ): Promise<{ exists: boolean }> {
    return IonicCouchbaseLite.Database_Exists({
      name: databaseName,
      existsName: name,
      directory,
    });
  }

  async Database_Close(databaseName: string): Promise<void> {
    return IonicCouchbaseLite.Database_Close({
      name: databaseName,
    });
  }

  async Database_Compact(databaseName: string): Promise<void> {
    return IonicCouchbaseLite.Database_Compact({
      name: databaseName,
    });
  }

  async Database_Delete(databaseName: string): Promise<void> {
    return IonicCouchbaseLite.Database_Delete({
      name: databaseName,
    });
  }

  async Database_PurgeDocument(
    databaseName: string,
    document: Document | string,
  ): Promise<void> {
    const docId = typeof document === 'string' ? document : document.getId();
    return IonicCouchbaseLite.Database_PurgeDocument({
      name: databaseName,
      docId,
    });
  }

  async Database_DeleteDocument(
    databaseName: string,
    document: Document,
    concurrencyControl: ConcurrencyControl,
  ): Promise<void> {
    return IonicCouchbaseLite.Database_DeleteDocument({
      name: databaseName,
      docId: document.getId(),
      document: document.toDictionary(),
      concurrencyControl,
    });
  }

  async Database_GetDocument(
    databaseName: string,
    documentId: string,
  ): Promise<{ document: Document }> {
    return IonicCouchbaseLite.Database_GetDocument({
      name: databaseName,
      docId: documentId,
    });
  }

  async Database_SetLogLevel(domain: string, logLevel: number): Promise<void> {
    return IonicCouchbaseLite.Database_SetLogLevel({
      domain,
      logLevel,
    });
  }

  async Database_SetFileLoggingConfig(
    databaseName: string,
    config: DatabaseFileLoggingConfiguration,
  ): Promise<void> {
    return IonicCouchbaseLite.Database_SetFileLoggingConfig({
      name: databaseName,
      config,
    });
  }

  async Document_GetBlobContent(
    databaseName: string,
    documentId: string,
    key: string,
  ): Promise<ArrayBuffer> {
    const data = await IonicCouchbaseLite.Document_GetBlobContent({
      name: databaseName,
      documentId,
      key,
    });
    return new Uint8Array(data.data).buffer;
  }

  async Query_Execute(databaseName: string, query: Query): Promise<ResultSet> {
    query.check();
    const ret = await IonicCouchbaseLite.Query_Execute({
      name: databaseName,
      query: query.toJson(),
      columnNames: query.getColumnNames(),
    });
    return new ResultSet(query, ret.id, query.getColumnNames());
  }

  async ResultSet_Next(
    databaseName: string,
    resultSetId: string,
  ): Promise<Result> {
    return IonicCouchbaseLite.ResultSet_Next({
      name: databaseName,
      resultSetId,
    });
  }

  async ResultSet_NextBatch(
    databaseName: string,
    resultSetId: string,
  ): Promise<{ results: Result[] }> {
    return IonicCouchbaseLite.ResultSet_NextBatch({
      name: databaseName,
      resultSetId,
    });
  }

  ResultSet_AllResults(
    databaseName: string,
    resultSetId: string,
    cb: (data: any, err: any) => void,
  ): Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.ResultSet_AllResults(
      {
        name: databaseName,
        resultSetId,
      },
      cb,
    );
  }

  async ResultSet_Cleanup(
    databaseName: string,
    resultSetId: string,
  ): Promise<void> {
    return IonicCouchbaseLite.ResultSet_Cleanup({
      name: databaseName,
      resultSetId,
    });
  }

  async Replicator_Create(
    databaseName: string,
    config: ReplicatorConfiguration,
  ): Promise<EngineReplicatorStartResult> {
    return IonicCouchbaseLite.Replicator_Create({
      name: databaseName,
      config: config.toJson(),
    });
  }

  async Replicator_Start(replicatorId: string): Promise<void> {
    return IonicCouchbaseLite.Replicator_Start({
      replicatorId,
    });
  }

  async Replicator_Restart(replicatorId: string): Promise<void> {
    return IonicCouchbaseLite.Replicator_Restart({
      replicatorId,
    });
  }

  Replicator_AddChangeListener(
    replicatorId: string,
    cb: (data: any, err: any) => void,
  ): Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.Replicator_AddChangeListener(
      {
        replicatorId,
      },
      cb,
    );
  }

  Replicator_AddDocumentListener(
    replicatorId: string,
    cb: (data: any, err: any) => void,
  ): Promise<PluginListenerHandle> {
    return IonicCouchbaseLite.Replicator_AddDocumentListener(
      {
        replicatorId,
      },
      cb,
    );
  }

  async Replicator_Stop(replicatorId: string): Promise<void> {
    return IonicCouchbaseLite.Replicator_Stop({
      replicatorId,
    });
  }

  async Replicator_ResetCheckpoint(replicatorId: string): Promise<void> {
    return IonicCouchbaseLite.Replicator_ResetCheckpoint({
      replicatorId,
    });
  }

  async Replicator_GetStatus(replicatorId: string): Promise<void> {
    return IonicCouchbaseLite.Replicator_GetStatus({
      replicatorId,
    });
  }

  async Replicator_Cleanup(replicatorId: string): Promise<void> {
    return IonicCouchbaseLite.Replicator_Cleanup({
      replicatorId,
    });
  }
}