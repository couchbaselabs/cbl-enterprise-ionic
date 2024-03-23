import {
  IonicCouchbaseLitePlugin,
  DatabaseChangeListener,
  ListenerToken,
} from '../definitions';

import { EngineLocator, Database, ICoreEngine } from 'cblite';

export class ChangeListeners {
  private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);
  private _platformEngine = this._engine as IonicCouchbaseLitePlugin;
  private _database: Database;
  private _didStartListener = false;

  private _databaseChangeListenerTokens: DatabaseChangeListener[] = [];

  constructor(database: Database) {
    this._database = database;
  }

  /**
   * Set the given DatabaseChangeListener to the this database.
   */

  async addChangeListener(listener: DatabaseChangeListener) {
    this._databaseChangeListenerTokens.push(listener);

    if (!this._didStartListener) {
       await this._platformEngine.Database_AddChangeListener(
        {
          name: this._database.getName(),
        },
        (data: any, err: any) => {
          if (err) {
            console.log('Database change listener error', err);
            return;
          }
          this.notifyDatabaseChangeListeners(data);
        },
      );
      this._didStartListener = true;
    }
  }

  /**
   * Remove the given DatabaseChangeListener from the this database.
   */
  removeChangeListener(listener: ListenerToken) {
    this._databaseChangeListenerTokens =
      this._databaseChangeListenerTokens.filter(l => l !== listener);
  }

  private notifyDatabaseChangeListeners(data: any) {
    this._databaseChangeListenerTokens.forEach(l => l(data));
  }
}
