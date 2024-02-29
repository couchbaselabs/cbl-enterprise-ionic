// QueryRoutes.tsx
import { Route } from 'react-router-dom';

import {
  LiveQueryPage,
  QueryBuilderPage,
  SqlPlusPlusPage,
} from '../pages/query';

export const QueryRoutes = [
  <Route path="/query/liveQuery" component={LiveQueryPage} exact />,
  <Route path="/query/queryBuilder" component={QueryBuilderPage} exact />,
  <Route path="/query/sqlPlusPlus" component={SqlPlusPlusPage} exact />,
];
