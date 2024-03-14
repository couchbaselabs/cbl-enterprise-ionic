// Notifications.tsx
import React from 'react';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import { NotificationTests } from 'couchbase-lite-ee-ionic';

const NotificationsTestPage: React.FC = () => {

  return (
    <DetailPageTestContainerRunner
      navigationTitle="Notifications Tests"
      collapseTitle="Notifications Tests"
      testCase={NotificationTests}
    ></DetailPageTestContainerRunner>
  );
};
export default NotificationsTestPage;
