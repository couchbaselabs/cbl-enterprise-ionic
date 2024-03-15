// CustomLoggingTests.tsx
import React, { useState } from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { CustomLoggingTests } from 'cblite-core-tests';

const CustomLoggingTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Custom Logging Tests"
      collapseTitle="Custom Logging Tests"
      testCase={CustomLoggingTests}
    ></DetailPageTestContainerRunner>
  );
};
export default CustomLoggingTestsPage;
