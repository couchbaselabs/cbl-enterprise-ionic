export interface ITestResult<T> {
	success: boolean;
  	message: string | undefined;
  	data: T | undefined;
}

export interface ITestCaseResult {
	name: string;
	success: boolean;
  	errorMessage: string | undefined;
}
