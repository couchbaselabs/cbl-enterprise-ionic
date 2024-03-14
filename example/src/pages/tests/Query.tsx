// Query.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { QueryTests } from 'couchbase-lite-ee-ionic';

const QueryTestPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Query SQL++ Tests"
      collapseTitle="Query SQL++ Tests"
      testCase={QueryTests}
    ></DetailPageTestContainerRunner>
  );
};
export default QueryTestPage;
