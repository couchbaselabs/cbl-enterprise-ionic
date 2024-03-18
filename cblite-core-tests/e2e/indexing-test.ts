import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/**
 * IndexingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class IndexingTests extends TestCase {
  constructor() {
    super();
  }

  /**
   * This is a test that creates an index and then verifies that the index
   * was created.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateIndex(): Promise<ITestResult> {
    return {
      testName: 'testCreateIndex',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   * This is a test that creates an FTS index and then verifies that the index
   * was created.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFullTextIndexExpression(): Promise<ITestResult> {
    return {
      testName: 'testCreateIndex',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   * This is a test that will text using FTS with Query Builder and a join that verifies that the index
   * was created.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFTSQueryWithJoin(): Promise<ITestResult> {
    return {
      testName: 'testFTSQueryWithJoin',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

    /**
   * This is a test that test making an index twice and making sure
   * that we get an error and don't crash the app. 
   * was created.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
    async testCreateSameIndexTwice(): Promise<ITestResult> {
      return {
        testName: 'testCreateSameIndexTwice',
        success: false,
        message: 'Not implemented',
        data: undefined
      };
    }

  /**
   * This is a test that tests deleting an index 
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
        async testDeleteIndex(): Promise<ITestResult> {
          return {
            testName: 'testDeleteIndex',
            success: false,
            message: 'Not implemented',
            data: undefined
          };
        }
}
