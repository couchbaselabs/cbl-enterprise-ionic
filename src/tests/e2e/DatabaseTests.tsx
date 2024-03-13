import { TestCase } from './TestCase';

import { 
	ITestResult, 
	ITestCaseResult 
} from './TestResult.types';

import { Database } from '../../couchbase-lite/database';

export class DatabaseTests extends TestCase{

	constructor(showDetails: boolean) {
		super(showDetails);	
	}



}