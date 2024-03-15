// VectorSearch.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { VectorSearchTests } from 'cblite-core-tests';

const VectorSearchTestsPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="Vector Search Tests"
      collapseTitle="Vector Search Tests"
      testCase={VectorSearchTests}
    ></DetailPageTestContainerRunner>
  );
};
export default VectorSearchTestsPage;
