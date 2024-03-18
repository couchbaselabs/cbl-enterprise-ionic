// Collection.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { TestingTests } from 'cblite-core-tests';

const TestingTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Testing Tests"
      collapseTitle="Testing Tests"
      testCases={[TestingTests]}
    ></DetailPageTestContainerRunner>
  );
};
export default TestingTestsPage;
