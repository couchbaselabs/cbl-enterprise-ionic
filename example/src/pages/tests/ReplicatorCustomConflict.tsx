// ReplicatorCustomConflicts.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ReplicatorCustomConflictsTests } from 'couchbase-lite-ee-ionic';

const ReplicatorCustomConflictTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Sync Conflicts Tests"
      collapseTitle="Sync Conflicts Tests"
      testCase={ReplicatorCustomConflictsTests}
    ></DetailPageTestContainerRunner>
  );
};
export default ReplicatorCustomConflictTestsPage;
