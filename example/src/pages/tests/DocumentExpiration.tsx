// DocumentExpiration.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { DocumentExpirationTests } from 'couchbase-lite-ee-ionic';

const DocumentExpirationTestsPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Doc Expiration Tests"
      collapseTitle="Doc Expiration Tests"
      testCase={DocumentExpirationTests}
    ></DetailPageTestContainerRunner>
  );
};
export default DocumentExpirationTestsPage;
