import React from 'react';
import {
    IonApp,
    IonContent,
    IonHeader,
    IonMenu,
    IonButtons,
    IonMenuButton,
    IonRouterOutlet,
    IonPage,
    IonSplitPane,
    IonTitle,
    IonToolbar,
    setupIonicReact,
} from '@ionic/react';

import {IonReactRouter} from '@ionic/react-router';
import {
    Route,
    Redirect
} from 'react-router-dom';
import Menu from './components/Menu/Menu';
import Page from './pages/Page';

import {
    DatabaseSetupPage,
    DatabaseOpenPage,
    DatabaseChangePage,
    DatabaseClosePage,
    DatabaseCopyPage,
    DatabaseDeletePage,
    CreateCollectionPage,
    ListCollectionsPage,
    PerformMaintenancePage
} from './pages/databases';

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
} from './pages/documents';

import {
    CreateIndexPage,
    CreateFTSIndexPage,
    DeleteIndexPage,
    ListIndexesPage
} from './pages/indexes';

import {
    LiveQueryPage,
    QueryBuilderPage,
    SqlPlusPlusPage,
} from './pages/query';

import ConsoleLogPage from './pages/logging/ConsoleLog';
import CustomLogPage from './pages/logging/CustomLog';
import FileLogPage from './pages/logging/FileLog';

import {
    ReplicatorPage
} from './pages/replication/';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
    return (
        <IonApp>
            <IonReactRouter>
                <IonSplitPane contentId="main">
                    <Menu/>
                    <IonRouterOutlet id="main">

                        <Route path="/log/console" component={ConsoleLogPage} exact/>
                        <Route path="/log/file" component={FileLogPage} exact/>
                        <Route path="/log/custom" component={CustomLogPage} exact/>
                        <Route path="/databases/setup" component={DatabaseSetupPage} exact/>
                        <Route path="/databases/open" component={DatabaseOpenPage} exact/>
                        <Route path="/databases/close" component={DatabaseClosePage} exact/>
                        <Route path="/databases/copy" component={DatabaseCopyPage} exact/>
                        <Route path="/databases/change" component={DatabaseChangePage} exact/>
                        <Route path="/databases/delete" component={DatabaseDeletePage} exact/>
                        <Route path="/databases/createCollection" component={CreateCollectionPage} exact/>
                        <Route path="/databases/listCollections" component={ListCollectionsPage} exact/>
                        <Route path="/databases/maintenance" component={PerformMaintenancePage} exact/>

                        <Route path="/documents/create" component={CreateDocumentPage} exact/>
                        <Route path="/documents/get" component={GetDocumnetPage} exact/>
                        <Route path="/documents/update" component={UpdateDocumnetPage} exact/>
                        <Route path="/documents/change" component={ChangeDocumnetPage} exact/>
                        <Route path="/documents/delete" component={DeleteDocumentPage} exact/>
                        <Route path="/documents/blob/create" component={CreateBlobPage} exact/>
                        <Route path="/documents/blob/get" component={GetBlobPage} exact/>
                        <Route path="/documents/blob/delete" component={DeleteBlobPage} exact/>
                        <Route path="/documents/batch/create" component={CreateBatchPage} exact/>

                        <Route path="/index/create" component={CreateIndexPage} exact />
                        <Route path="/index/createFTS" component={CreateFTSIndexPage} exact />
                        <Route path="/index/delete" component={DeleteIndexPage} exact />
                        <Route path="/index/list" component={ListIndexesPage} exact />

                        <Route path="/query/liveQuery" component={LiveQueryPage} exact />
                        <Route path="/query/queryBuilder" component={QueryBuilderPage} exact />
                        <Route path="/query/sqlPlusPlus" component={SqlPlusPlusPage} exact />

                        <Route path="/replication/replicator" component={ReplicatorPage} exact />

                        <Route path="/home" component={Page} exact/>
                        <Redirect from="/" to="/home" exact/>
                    </IonRouterOutlet>
                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;