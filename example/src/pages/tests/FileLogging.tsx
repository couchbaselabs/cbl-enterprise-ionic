// FileLogging.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { FileLoggingTests } from 'couchbase-lite-ee-ionic';

const FileLoggingTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="File Logging Tests"
      collapseTitle="File Loggin Tests"
      testCase={FileLoggingTests}
    ></DetailPageTestContainerRunner>
  );
};
export default FileLoggingTestsPage;
