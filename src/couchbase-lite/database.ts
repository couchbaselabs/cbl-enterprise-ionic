import { Document } from './document';
import { MutableDocument } from './mutable-document';
import { DatabaseConfiguration } from './database-configuration';
import { DatabaseLogging } from './database-logging';

import { AbstractIndex } from './abstract-index';

import { CapacitorEngine } from './engine/capacitor';
import { ConcurrencyControl } from './concurrency-control';

export interface File {}

export interface DatabaseChange {
  documentIDs: string[];
}

export interface DocumentChange {
  documentID: string;
}

export interface ListenerToken {}

export type DatabaseChangeListener = (change: DatabaseChange) => void;
export type DocumentChangeListener = (change: DocumentChange) => void;

export enum LogDomain {
  ALL = 'ALL',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  QUERY = 'QUERY',
  REPLICATOR = 'REPLICATOR',
}

export enum LogLevel {
  DEBUG = 0,
  VERBOSE = 1,
  INFO = 2,
  WARNING = 3,
  ERROR = 4,
  NONE = 5,
}

/**
 * A Couchbase Lite database.
 */
export class Database {
  _documents: { [id: string]: Document } = {};

  private changeListenerTokens: DatabaseChangeListener[] = [];

  private _engine: CapacitorEngine = new CapacitorEngine();

  private didStartListener = false;

  public log = new DatabaseLogging(this);

  constructor(
    private name: string,
    private config: DatabaseConfiguration = null,
  ) {}

  getEngine() {
    return this._engine;
  }

  /**
   * Open the database
   */
  open() {
    return this._engine.Database_Open(this.name, this.config);
  }

  /**
   * Set the given DatabaseChangeListener to the this database.
   */
  addChangeListener(listener: DatabaseChangeListener) {
    this.changeListenerTokens.push(listener);

    if (!this.didStartListener) {
      this._engine.Database_AddChangeListener(
        this.getName(),
        (data: any, err: any) => {
          if (err) {
            console.log('Database change listener error', err);
            return;
          }
          this.notifyDatabaseChangeListeners(data);
        },
      );
      this.didStartListener = true;
    }
  }

  private notifyDatabaseChangeListeners(data: any) {
    this.changeListenerTokens.forEach(l => l(data));
  }

  /**
   * Add the given DocumentChangeListener to the specified document.
   */
  addDocumentChangeListener(
    id: string,
    listener: DocumentChangeListener,
  ): Promise<ListenerToken> {
    id;
    listener;
    return null;
  }

  /**
   * Remove the given DatabaseChangeListener from the this database.
   */
  removeChangeListener(listener: ListenerToken) {
    this.changeListenerTokens = this.changeListenerTokens.filter(
      l => l !== listener,
    );
  }

  /**
   * Closes a database.
   */
  close() {
    return this._engine.Database_Close(this.name);
  }

  /**
   * Compacts the database file by deleting unused attachment files and vacuuming the SQLite database
   */
  compact(): Promise<void> {
    return this._engine.Database_Compact(this.name);
  }

  /**
   * Copy database 
   */
  copy(
    path: string,
    name: string,
    config: DatabaseConfiguration,
  ): Promise<void> {
    path;
    name;
    config;
    return this._engine.Database_Copy(this.name, path, name, config);
  }

  /**
   * Deletes a database.
   */
  deleteDatabase() {
    return this._engine.Database_Delete(this.name);
  }

  /**
   * Return the database's path.
   */
  async getPath(): Promise<string> {
    return (await this._engine.Database_GetPath(this.name)).path;
  }

  /**
   * Checks whether a database of the given name exists in the given directory or not.
   */
  async exists(name: string, directory: string): Promise<boolean> {
    const ret = await this._engine.Database_Exists(this.name, name, directory);
    return ret.exists;
  }

  /**
   * Return the database name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Returns a READONLY config object which will throw a runtime exception when any setter methods are called.
   */
  getConfig(): DatabaseConfiguration {
    return this.config;
  }

  /**
   * Deletes a document from the database.
   */
  deleteDocument(
    document: Document,
    concurrencyControl: ConcurrencyControl = null,
  ): Promise<void> {
    return this._engine.Database_DeleteDocument(
      this.name,
      document,
      concurrencyControl,
    );
  }

  /**
   * Purges the given document from the database.
   */
  purgeDocument(document: Document | string) {
    return this._engine.Database_PurgeDocument(this.name, document);
  }

  /**
   * The number of documents in the database.
   */
  async getCount(): Promise<number> {
    const count = await this._engine.Database_GetCount(this.name);
    return Promise.resolve(count.count);
  }

  /**
   * Gets an existing Document object with the given ID.
   */
  async getDocument(id: string): Promise<Document> {
    const docJson = await this._engine.Database_GetDocument(this.name, id);
    if (docJson) {
      const data = docJson['_data'];
      const sequence = docJson['_sequence'];
      const retId = docJson['_id'];
      return Promise.resolve(new Document(retId, sequence, data));
    } else {
      return Promise.resolve(null);
    }
  }

  /**
   * Runs a group of database operations in a batch.
   */
  inBatch(fn: () => void): Promise<void> {
    fn;
    return Promise.reject(null);
  }

  /**
   * Saves a document to the database
   */
  async save(
    document: MutableDocument,
    concurrencyControl: ConcurrencyControl = null,
  ): Promise<void> {
    const ret = await this._engine.Database_Save(
      this.name,
      document,
      concurrencyControl,
    );

    const id = ret._id;
    document.setId(id);
    this._documents[id] = document;
  }

  /**
   * createIndex - Create an index with the given name and index object
   */
  createIndex(indexName: string, index: AbstractIndex): Promise<void> {
    indexName;
    index;
    return this._engine.Database_CreateIndex(this.name, indexName, index);
  }

  /**
   * Return the indexes in the database
   */
  async getIndexes(): Promise<string[]> {
    return (await this._engine.Database_GetIndexes(this.name)).indexes;
  }

  /**
   * Deletes an index
   */
  deleteIndex(indexName: string): Promise<void> {
    return this._engine.Database_DeleteIndex(this.name, indexName);
  }

  /**
   * Set log level for the given log domain.
   */
  setLogLevel(domain: LogDomain, level: LogLevel): Promise<void> {
    return this._engine.Database_SetLogLevel(domain, level);
  }
}