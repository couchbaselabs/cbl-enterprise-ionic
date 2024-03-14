// QueryBuilder.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { QueryBuilderTests } from 'couchbase-lite-ee-ionic';

const QueryBuilderTestPage: React.FC = () => {
  return (
    <DetailPageTestContainerRunner
      navigationTitle="QueryBuilder Tests"
      collapseTitle="QueryBuilder Tests"
      testCase={QueryBuilderTests}
    ></DetailPageTestContainerRunner>
  );
};
export default QueryBuilderTestPage;
