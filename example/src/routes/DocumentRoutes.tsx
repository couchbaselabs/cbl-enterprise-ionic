// DocumentRoutes.tsx
import { Route } from 'react-router-dom';

import {
  CreateBlobPage,
  CreateDocumentPage,
  DeleteBlobPage,
  DeleteDocumentPage,
  GetBlobPage,
  UpdateDocumnetPage,
  GetDocumnetPage,
  ChangeDocumnetPage,
  CreateBatchPage,
} from '../pages/documents';

export const DocumentRoutes = [
  <Route path="/documents/create" component={CreateDocumentPage} exact />,
  <Route path="/documents/get" component={GetDocumnetPage} exact />,
  <Route path="/documents/update" component={UpdateDocumnetPage} exact />,
  <Route path="/documents/change" component={ChangeDocumnetPage} exact />,
  <Route path="/documents/delete" component={DeleteDocumentPage} exact />,
  <Route path="/documents/blob/create" component={CreateBlobPage} exact />,
  <Route path="/documents/blob/get" component={GetBlobPage} exact />,
  <Route path="/documents/blob/delete" component={DeleteBlobPage} exact />,
  <Route path="/documents/batch/create" component={CreateBatchPage} exact />,
];
