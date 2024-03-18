import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/**
 * NotificationTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class NotificationTests extends TestCase {
  constructor() {
    super();
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDatabaseChange(): Promise<ITestResult> {
    return {
      testName: 'testDatabaseChange',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentChange(): Promise<ITestResult> {
    return {
      testName: 'testDocumentChange',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testAddSameChangeListeners(): Promise<ITestResult> {
    return {
      testName: 'testAddSameChangeListeners',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRemoveDocumentChangeListener(): Promise<ITestResult> {
    return {
      testName: 'testRemoveDocumentChangeListener',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }
}
