// PredicateQuery.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { PredicateQueryTests } from 'couchbase-lite-ee-ionic';

const PredicateQueryTestPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Predicate Query Tests"
      collapseTitle="Predicate Query Tests"
      testCase={PredicateQueryTests}
    ></DetailPageTestContainerRunner>
  );
};
export default PredicateQueryTestPage;
