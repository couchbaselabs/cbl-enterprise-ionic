// FTS.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { FTSTests } from 'cblite-core-tests';

const FTSTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="FTS Tests"
      collapseTitle="FTS Tests"
      testCase={FTSTests}
    ></DetailPageTestContainerRunner>
  );
};
export default FTSTestsPage;
