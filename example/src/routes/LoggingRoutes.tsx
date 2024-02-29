// LoggingRoutes.tsx
import { Route } from 'react-router-dom';

import { ConsoleLogPage, FileLogPage, CustomLogPage } from '../pages/logging';

export const LoggingRoutes = [
  <Route path="/logging/console" component={ConsoleLogPage} exact />,
  <Route path="/logging/file" component={FileLogPage} exact />,
  <Route path="/logging/custom" component={CustomLogPage} exact />,
];
