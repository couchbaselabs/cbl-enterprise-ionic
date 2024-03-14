import { ITestResult } from './test-result.types';

import { TestCase } from './test-case';

export class TestRunner {
  async *runTests<T extends TestCase>(
    testCase: new () => T,
    showDetails: boolean,
    cancelToken: boolean,
  ): AsyncGenerator<ITestResult, void, unknown> {

    const instance = new testCase();
    instance.showDetails = showDetails;
    const initResult = await instance.init();

    if (initResult.success) {

      const methods = Object.getOwnPropertyNames(
        Object.getPrototypeOf(instance),
      ).filter(
        prop =>
          prop !== 'constructor' &&
          typeof instance[prop] === 'function' &&
          prop.startsWith('test'),
      );

      for (const method of methods) {
        if (cancelToken) {
          return;
        }
        const result: ITestResult = await instance[method]();
        yield result;
      }
    } else {
		//we failed to initailize the test case, return the failure
		yield initResult;
	}
  }
}
