import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/**
 * FileLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class FileLoggingTests extends TestCase {
  constructor() {
    super();
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFileLoggingLevels(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingLevels',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFileLoggingDefaultBinaryFormat(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingDefaultBinaryFormat',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFileLoggingUsePlainText(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingUsePlainText',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFileLoggingLogFilename(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingLogFilename',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFileLoggingMaxSize(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingMaxSize',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFileLoggingDisableLogging(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingDisableLogging',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFileLoggingReEnableLogging(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingReEnableLogging',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

    /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
    async testFileLoggingHeader(): Promise<ITestResult> {
      return {
        testName: 'testFileLoggingHeader',
        success: false,
        message: 'Not implemented',
        data: undefined,
      };
    }
}
