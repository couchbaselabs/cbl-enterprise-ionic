// Document.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { DocumentTests } from 'couchbase-lite-ee-ionic';

const DocumentTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Document Tests"
      collapseTitle="Document Tests"
      testCase={DocumentTests}
    ></DetailPageTestContainerRunner>
  );
};
export default DocumentTestsPage;
