import { ITestResult } from './test-result.types';
import { TestCase } from './test-case';

//todo fix cancel token implementation
export class TestRunner {
  async *runTests<T extends TestCase>(
    testCase: new () => T,
    cancelToken: () => boolean,
  ): AsyncGenerator<ITestResult, void, unknown> {
    const instance = new testCase();

    const methods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(instance),
    ).filter(
      prop =>
        prop !== 'constructor' &&
        typeof instance[prop] === 'function' &&
        prop.startsWith('test'),
    );

    for (const method of methods) {
      if (cancelToken()) {
        return;
      }
      //start with a clean database
      const initResult = await instance.init();

      if (initResult.success) {
        //yield that we are running a test
        let runningResult: ITestResult = {
          testName: method,
          success: true,
          message: 'running',
          data: undefined,
        };
        yield runningResult;

        //run the actual test
        const result: ITestResult = await instance[method]();
        //sleep for 1 second to try and fix android issues with deleting databases
        await new Promise(resolve => setTimeout(resolve, 300));
        await instance.init();
        yield result;
      } else {
        //we failed to initailize the test case, return the failure
        yield initResult;
      }
      //clean up the test case remove database
      //instance.tearDown();
    }
  }
}