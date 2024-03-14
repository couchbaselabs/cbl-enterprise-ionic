import { PlatformDirectory } from '../../platform-directory';
import { Database } from '../../database';
import { DatabaseConfiguration } from '../../database-configuration';

import { ITestResult } from './test-result.types';

export class TestCase {
  //setup shared properties
  database: Database | undefined = undefined;
  otherDatabase: Database | undefined = undefined;
  databaseName: string = 'testDb';
  otherDatabaseName: string = 'otherDb';
  directory: string | undefined = undefined;

  showDetails: boolean;

  constructor() {
    this.showDetails = false;
  }

  async init(): Promise<ITestResult> {
    try {
      //try to get the platform local directory - can't run tests if we can't save a database to a directory
      const filePathResult = await TestCase.getPlatformPath();
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
      const dbResult = await TestCase.getDatabase(
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

  async tearDown(): Promise<ITestResult> {
    try {
      await this.database?.close();
      await this.otherDatabase?.close();
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
        testName: 'deleteDatabase',
        success: true,
        message: undefined,
        data: undefined,
      };
    } catch (error: any) {
      return {
        testName: 'deleteDatabase',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  static async getPlatformPath(): Promise<ITestResult> {
    const pd = new PlatformDirectory();
    try {
      const result: string = await pd.getDefaultPath();
      return {
        testName: 'getPlatformPath',
        success: true,
        message: undefined,
        data: result,
      };
    } catch (error: any) {
      return {
        testName: 'getPlatformPath',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  static async getDatabase(
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
}
