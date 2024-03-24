import {
  IonicCouchbaseLitePlugin,
  DatabaseChangeListener,
} from '../definitions';

import { 
  EngineLocator, 
  Database, 
  ICoreEngine,
  uuid 
} from 'cblite';

export class ChangeListeners {
  private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);
  private _platformEngine = this._engine as IonicCouchbaseLitePlugin;
  private _database: Database;
  private _changeListenerToken: string; 
  private _didStartListener = false;

  private _databaseChangeListenerTokens: { [key: string]: DatabaseChangeListener } = {};

  constructor(database: Database) {
    this._database = database;
    this._changeListenerToken = uuid();
  }

  getDatabaseChangeListenerToken() :string {
    return this._changeListenerToken;
  }

  /**
   * Set the given DatabaseChangeListener to the this database.
   */

  async addChangeListener(listener: DatabaseChangeListener) {
    this._databaseChangeListenerTokens[this._changeListenerToken] = listener;

    if (!this._didStartListener) {
       await this._platformEngine.Database_AddChangeListener(
        {
          name: this._database.getName(),
          changeListenerToken: this._changeListenerToken, 
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
  async removeChangeListener() {
    delete this._databaseChangeListenerTokens[this._changeListenerToken];
    await this._platformEngine.Database_RemoveChangeListener({
          name: this._database.getName(),
          changeListenerToken: this._changeListenerToken, 
    });
    this._changeListenerToken = uuid();
  }

  private notifyDatabaseChangeListeners(data: any) {
    let changeListener = this._databaseChangeListenerTokens[this._changeListenerToken];
    changeListener(data);
  }
}
