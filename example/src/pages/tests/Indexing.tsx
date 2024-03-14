// Indexing.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { IndexingTests } from 'couchbase-lite-ee-ionic';

const IndexingTestPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Index Tests"
      collapseTitle="Index Tests"
      testCase={IndexingTests}
    ></DetailPageTestContainerRunner>
  );
};
export default IndexingTestPage;
