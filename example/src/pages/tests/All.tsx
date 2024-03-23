// All.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { 
	ConsoleLoggingTests,
	CustomLoggingTests,
	DatabaseTests,
	DocumentTests,
	DocumentExpirationTests,
	FileLoggingTests,
	FragmentTests,
	IndexingTests,
	NotificationTests,
	PredicateQueryTests,
	QueryBuilderTests,
	QueryTests,
	ReplicatorTests
} from 'cblite-tests';

const AllTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="All Tests"
      collapseTitle="All Tests"
      testCases={[
		ConsoleLoggingTests,
		CustomLoggingTests,
		DatabaseTests,
		DocumentTests,
		DocumentExpirationTests,
		FileLoggingTests,
		FragmentTests,
		IndexingTests,
		NotificationTests,
		PredicateQueryTests,
		QueryBuilderTests,
		QueryTests,
		ReplicatorTests
	]}
    ></DetailPageTestContainerRunner>
  );
};
export default AllTestsPage;
