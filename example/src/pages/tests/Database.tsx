// Database.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { DatabaseTests } from 'couchbase-lite-ee-ionic';

const DatabaseTestsPage: React.FC = () => {

  return (
  	<DetailPageTestContainerRunner
 	 	navigationTitle="Database Tests"
  		collapseTitle="Database Tests"
		testCase={DatabaseTests}
		>
  	</DetailPageTestContainerRunner>
	);
};
export default DatabaseTestsPage;
