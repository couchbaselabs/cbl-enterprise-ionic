// QueryBuilder.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerItemResults from '../../components/DetailPageContainerItemResults/DetailPageContainerItemResults';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';
import {
  DataGeneratorService,
  ProductType,
  WidgetType,
} from '../../services/DataGeneratorService';

import { QueryBuilderGeneratorService } from '../../services/QueryBuilderGeneratorService';

import {
  IonItemDivider,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

import {
  Database,
  MutableDocument,
  QueryBuilder,
  SelectResult,
  DataSource,
  Expression,
  Meta,
} from 'couchbase-lite-ee-ionic';

import { playOutline } from 'ionicons/icons';

const QueryBuilderPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);
  const [resultsCount, setResultsCount] = useState<string>('');
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  //set the select list of queries we can test
  const queries: string[] = QueryBuilderGeneratorService.queries;

  function update() {

  }

  function reset() {
    setDatabaseName('');
    setResultsCount('');
    setResultsMessage([]);
  }

  return (
    <DetailPageContainerItemResults
      navigationTitle="Query Builder"
      collapseTitle="Query Builder"
      onReset={reset}
      resultsCount={resultsCount}
      children={
        <>
          <DatabaseNameForm
            setDatabaseName={setDatabaseName}
            databaseName={databaseName}
          />
          <IonItemDivider>
            <IonLabel>Query Builder</IonLabel>
            <IonButtons slot="end">
              <IonButton
                onClick={update}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px 5px',
                }}
              >
                <IonIcon icon={playOutline} />
              </IonButton>
            </IonButtons>
          </IonItemDivider>
          <IonItem key={2}>
          <IonLabel>Select Query</IonLabel>
          <IonSelect
            value={selectedQuery}
            onIonChange={e => setSelectedQuery(e.detail.value)}
          >
            {queries.map((query) => (
              <IonSelectOption value={query}>{query}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        </>
      }
      resultsChildren={<></>}
    ></DetailPageContainerItemResults>
  );
};

export default QueryBuilderPage;
