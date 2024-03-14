// Collection.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { CollectionTests } from 'couchbase-lite-ee-ionic';

const CollectionTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Collection Tests"
      collapseTitle="Collection Tests"
      testCase={CollectionTests}
    ></DetailPageTestContainerRunner>
  );
};
export default CollectionTestsPage;
