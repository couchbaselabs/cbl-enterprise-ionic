// ReplicatorPendingDoc.tsx
import React, { useState } from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ReplicatorPendindDocIdsTests } from 'cblite-core-tests';

const ReplicatorPendingDocTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Sync Pending Doc Tests"
      collapseTitle="Sync Pending Doc Tests"
      testCase={ReplicatorPendindDocIdsTests}
    ></DetailPageTestContainerRunner>
  );
};
export default ReplicatorPendingDocTestsPage;
