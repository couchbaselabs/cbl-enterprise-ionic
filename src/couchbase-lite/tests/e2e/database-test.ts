import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
import { MutableDocument } from '../../mutable-document';

/**
 * DatabaseTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class DatabaseTests extends TestCase {
  constructor() {
    super();
  }
  /**
   * This method creates a new document with a predefined ID and name, saves it to the database,
   * and then verifies the document by comparing it with the expected data.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateDocument(): Promise<ITestResult> {
    const id = '123';
    const doc = new MutableDocument();
    doc.setId(id);
    doc.setString('name', 'Scott');
    let dic = doc.toDictionary;

    await this.database?.save(doc);
    return this.verifyDoc('testCreateDocument', id, JSON.stringify(dic));
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
        doc.getId() === withId &&
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
          success: true,
          message: 'failed',
          data: "id or data doesn't match",
        };
      }
    }
  }
}
