// ConsoleLogging.tsx
import React, { useState } from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { ConsoleLoggingTests } from 'couchbase-lite-ee-ionic';

const ConsoleLoggingTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Console Logging Tests"
      collapseTitle="Console Logging Tests"
      testCase={ConsoleLoggingTests}
    ></DetailPageTestContainerRunner>
  );
};
export default ConsoleLoggingTestsPage;