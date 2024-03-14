import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/**
 * CollectionTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class CollectionTests extends TestCase {
  constructor() {
    super();
  }

  /**
   * This is a sample test that just returns a passing result. It's used to test the test runner.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRunnerPass(): Promise<ITestResult> {
    return {
      testName: 'testRunnerPass',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  /**
   * This is a sample test that just returns a failed result. It's used to test the test runner.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRunnerFail(): Promise<ITestResult> {
    return {
      testName: 'testRunnerFail',
      success: false,
      message: 'failed',
      data: undefined,
    };
  }

  async testRunnerTenSeconds(): Promise<ITestResult> {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return {
      testName: 'testRunnerTenSeconds',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  async testRunnerTwentySeconds(): Promise<ITestResult> {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return {
      testName: 'testRunnerTwentySeconds',
      success: true,
      message: 'success',
      data: undefined,
    };
  }
}
