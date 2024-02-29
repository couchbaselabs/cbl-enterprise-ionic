// DatabaseRoutes.tsx
import { Route } from 'react-router-dom';

import {
  DatabaseOpenPage,
  DatabaseChangePage,
  DatabaseClosePage,
  DatabaseCopyPage,
  DatabaseDeletePage,
  CreateCollectionPage,
  ListCollectionsPage,
  PerformMaintenancePage
} from '../pages/databases';

export const DatabaseRoutes = [
  <Route path="/databases/open" component={DatabaseOpenPage} exact />,
  <Route path="/databases/close" component={DatabaseClosePage} exact />,
  <Route path="/databases/copy" component={DatabaseCopyPage} exact />,
  <Route path="/databases/change" component={DatabaseChangePage} exact />,
  <Route path="/databases/delete" component={DatabaseDeletePage} exact />,
  <Route
    path="/databases/createCollection"
    component={CreateCollectionPage}
    exact
  />,
  <Route
    path="/databases/listCollections"
    component={ListCollectionsPage}
    exact
  />,
  <Route
    path="/databases/maintenance"
    component={PerformMaintenancePage}
    exact
    />
];
