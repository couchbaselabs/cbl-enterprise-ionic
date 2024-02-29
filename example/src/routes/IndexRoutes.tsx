// IndexRoutes.tsx
import { Route } from 'react-router-dom';

import {
	CreateIndexPage,
	CreateFTSIndexPage,
	DeleteIndexPage,
	ListIndexesPage
} from '../pages/indexes';

export const IndexRoutes = [
  <Route path="/index/create" component={CreateIndexPage} exact />,
  <Route path="/index/createFTS" component={CreateFTSIndexPage} exact />,
  <Route path="/index/delete" component={DeleteIndexPage} exact />,
  <Route path="/index/list" component={ListIndexesPage} exact />,
];
