import { IonicCouchbaseLite } from '../../index';
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
export interface EngineDatabaseSaveResult {
	_id: string;
}
  
export interface EngineReplicatorStartResult {
	replicatorId: string;
}

export class EngineService {

  async PluginConfigure(config: any): Promise<void> {
    return IonicCouchbaseLite.Plugin_Configure({
      config,
    });
  }

  async DatabaseOpen(
    name: string,
    config: DatabaseConfiguration,
  ): Promise<void> {
    return IonicCouchbaseLite.Database_Open({
      name,
      config,
    });
  }
  async Database_Save(
    databaseName: string,
    document: MutableDocument,
    concurrencyControl: ConcurrencyControl,
  ): Promise<EngineDatabaseSaveResult> {

  }


}
