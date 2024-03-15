// Collection.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { TestingTests } from 'couchbase-lite-ee-ionic';

const TestingTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Testing Tests"
      collapseTitle="Testing Tests"
      testCase={TestingTests}
    ></DetailPageTestContainerRunner>
  );
};
export default TestingTestsPage;
