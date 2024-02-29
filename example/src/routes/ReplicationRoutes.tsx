// ReplicationRoutes.tsx
import { Route } from 'react-router-dom';

import { ReplicatorPage } from '../pages/replication/';

export const ReplicationRoutes = [
  <Route path="/replication/replicator" component={ReplicatorPage} exact />,
];
