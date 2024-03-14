// Replicator.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ReplicatorTests } from 'couchbase-lite-ee-ionic';

const ReplicatorTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Replicator Tests"
      collapseTitle="Replicator Tests"
      testCase={ReplicatorTests}
    ></DetailPageTestContainerRunner>
  );
};
export default ReplicatorTestsPage;
