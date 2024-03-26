import {
  Database,
  FileSystem,
  MutableDocument,
  DatabaseConfiguration,
  Dictionary,
  QueryBuilder,
  SelectResult,
  DataSource,
  Expression,
  Function,
} from 'cblite';

import { assert, expect } from 'chai';

import { ITestResult } from './test-result.types';

export class TestCase {
  [key: string]: any;

  //setup shared properties
  database: Database | undefined = undefined;
  otherDatabase: Database | undefined = undefined;
  databaseName: string = 'testDb';
  otherDatabaseName: string = 'otherDb';
  directory: string | undefined = undefined;

  async init(): Promise<ITestResult> {
    try {
      //try to get the platform local directory - can't run tests if we can't save a database to a directory
      const filePathResult = await this.getPlatformPath();
      if (filePathResult.success) {
        this.directory = filePathResult.data;
      } else {
        return {
          testName: 'init',
          success: false,
          message: filePathResult.message,
          data: undefined,
        };
      }

      //delete databases if they exist
      if (this.database !== undefined) {
        const deleteDbResult = await this.deleteDatabase(this.database);
        if (!deleteDbResult.success) {
          return deleteDbResult;
        }
      }

      if (this.otherDatabase !== undefined) {
        const deleteDbResult = await this.deleteDatabase(this.otherDatabase);
        if (!deleteDbResult.success) {
          return deleteDbResult;
        }
      }

      //create a database and then open it
      const dbResult = await this.getDatabase(
        this.databaseName,
        this.directory,
        '',
      );
      if (dbResult instanceof Database) {
        this.database = dbResult;
        await this.database?.open();
      } else {
        if (typeof dbResult === 'string') {
          const message = dbResult as string;
          return {
            testName: 'init',
            success: false,
            message: message,
            data: undefined,
          };
        }
      }
      return {
        testName: 'init',
        success: true,
        message: undefined,
        data: undefined,
      };
    } catch (error: any) {
      return {
        testName: 'init',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async deleteDatabase(db: Database): Promise<ITestResult> {
    try {
      await db.deleteDatabase();
      return {
        testName: this.constructor.name + '.deleteDatabase',
        success: true,
        message: undefined,
        data: undefined,
      };
    } catch (error: any) {
      if (error.errorMessage !== 'No such open database') {
        return {
          testName: this.constructor.name + '.deleteDatabase',
          success: false,
          message: JSON.stringify(error),
          data: undefined,
        };
      } else {
        return {
          testName: this.constructor.name + '.deleteDatabase',
          success: true,
          message: undefined,
          data: undefined,
        };
      }
    }
  }

  async getPlatformPath(): Promise<ITestResult> {
    const pd = new FileSystem();
    try {
      const result: string = await pd.getDefaultPath();
      return {
        testName: this.constructor.name + '.getPlatformPath',
        success: true,
        message: undefined,
        data: result,
      };
    } catch (error: any) {
      return {
        testName: this.constructor.name + '.getPlatformPath',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async getDatabase(
    name: string,
    path: string | undefined,
    encryptionKey: string | undefined,
  ): Promise<Database | string> {
    const config = new DatabaseConfiguration();
    try {
      config.directory = path ?? '';
      config.encryptionKey = encryptionKey ?? '';
      const db = new Database(name, config);
      return db;
    } catch (error: any) {
      return JSON.stringify(error);
    }
  }

  async createDocumentWithId(id: string): Promise<MutableDocument> {
    let doc = new MutableDocument(id);
    doc.setValue('key', 1);
    await this.database?.save(doc);
    let savedDoc = await this.database?.getDocument(id);
    assert.equal(savedDoc?.getId(), id);
    assert.equal(savedDoc?.getSequence(), 1);
    let mutableSavedDoc = MutableDocument.fromDocument(savedDoc);
    return mutableSavedDoc;
  }

  createDocumentWithIdAndData(id: string, data: Dictionary): MutableDocument {
    let doc = new MutableDocument(id);
    doc.setData(data);
    return doc;
  }

  createDocumentNumbered(start: number, end: number): MutableDocument[] {
    let docs: MutableDocument[] = [];
    for (let counter = start; counter <= end; counter++) {
      let doc = new MutableDocument('doc-' + counter);
      doc.setNumber('number', counter);
      docs.push(doc);
    }
    return docs;
  }

  async createDocs(
    methodName: string,
    number: number,
  ): Promise<MutableDocument[]> {
    let docs = this.createDocumentNumbered(1, number);
    try {
      for (let doc of docs) {
        await this.database?.save(doc);
      }
    } catch (error: any) {
      throw new Error("Can't create docs:" + JSON.stringify(error));
    }
    return docs;
  }

  async verifyDocs(testName: string, number: number): Promise<ITestResult> {
    try {
      for (let counter = 1; counter <= number; counter++) {
        let id = 'doc-' + counter;
        let doc = await this.database?.getDocument(id);
        let dictionary = doc.toDictionary();
        let json = JSON.stringify(dictionary);
        let verify = await this.verifyDoc(testName, id, json);
        if (!verify.success) {
          return verify;
        }
      }
    } catch (error: any) {
      return {
        testName: testName,
        success: false,
        message: 'failed',
        data: JSON.stringify(error),
      };
    }
    return {
      testName: testName,
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  async verifyDoc(
    testName: string,
    withId: string,
    withData: string,
  ): Promise<ITestResult> {
    const doc = await this.database?.getDocument(withId);
    if (doc === undefined && doc === null) {
      return {
        testName: testName,
        success: false,
        message: 'Document not found',
        data: undefined,
      };
    } else {
      if (
        doc?.getId() === withId &&
        JSON.stringify(doc.toDictionary) === withData
      ) {
        return {
          testName: testName,
          success: true,
          message: 'success',
          data: undefined,
        };
      } else {
        return {
          testName: testName,
          success: false,
          message: 'failed',
          data: "id or data doesn't match",
        };
      }
    }
  }

  async getDocumentCount(): Promise<number> {
    let query = QueryBuilder.select(
      SelectResult.expression(Function.count(Expression.string('*'))).as(
        'count',
      ),
    ).from(DataSource.database(this.database));
    let resultSet = await (await query.execute()).allResults();
    for (let result of resultSet) {
      return Number.parseInt(result.count);
    }
    return 0;
  }
}
