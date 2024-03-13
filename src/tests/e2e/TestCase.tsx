import { PlatformDirectory } from '../../couchbase-lite/platform-directory';
import { Database } from '../../couchbase-lite/database';
import { DatabaseConfiguration } from '../../couchbase-lite/database-configuration';

import { ITestResult } from './TestResult.types';

export class TestCase {
  //setup shared properties
  database: Database | undefined = undefined;
  otherDatabase: Database | undefined = undefined;
  databaseName: string = 'testDb';
  otherDatabaseName: string = 'otherDb';
  directory: string | undefined = undefined;

  showDetails: boolean;

  constructor(showDetails: boolean) {
	  this.showDetails = false;
  }

  async init(): Promise<ITestResult<undefined>> {
    try {
      //try to get the platform local directory - can't run tests if we can't save a database to a directory
      const filePathResult = await TestCase.getPlatformPath();
      if (filePathResult.success) {
        this.directory = filePathResult.data;
      } else {
        return {
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
      if (dbResult.success) {
        this.database = dbResult.data;
        await this.database?.open();
      } else {
        return {
          success: false,
          message: dbResult.message,
          data: undefined,
        };
      }

      return {
        success: true,
        message: undefined,
        data: undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async tearDown(): Promise<ITestResult<undefined>> {
    try {
      await this.database?.close();
      await this.otherDatabase?.close();
      return {
        success: true,
        message: undefined,
        data: undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async deleteDatabase(db: Database): Promise<ITestResult<undefined>> {
    try {
      await db.deleteDatabase();
      return {
        success: true,
        message: undefined,
        data: undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  static async getPlatformPath(): Promise<ITestResult<string>> {
    const pd = new PlatformDirectory();
    try {
      const result: string = await pd.getDefaultPath();
      return {
        success: true,
        message: undefined,
        data: result,
      };
    } catch (error: any) {
      return {
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
  ): Promise<ITestResult<Database>> {
    const config = new DatabaseConfiguration();
    try {
      config.directory = path ?? '';
      config.encryptionKey = encryptionKey ?? '';
      const db = new Database(name, config);
      return {
        success: true,
        message: undefined,
        data: db,
      };
    } catch (error: any) {
      return {
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }
}
