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

import {
  QueryGeneratorService,
  QueryDictionary,
} from '../../services/QueryBuilderGeneratorService';

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
  Query
} from 'couchbase-lite-ee-ionic';

import { playOutline } from 'ionicons/icons';

const QueryBuilderPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);
  const [resultsCount, setResultsCount] = useState<string>('');
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  //set the select list of queries we can test
  const queries: string[] = QueryGeneratorService.queries;

  async function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null && selectedQuery !== '') {
        setResultsMessage([]);
        let queries = QueryGeneratorService.getQueries(db);
        let query: Query | undefined;

        for (let dictionary of queries) {
          if (dictionary[selectedQuery]) {
            query = dictionary[selectedQuery];
            break;
          }
        }
        if (query !== undefined) {
          try {
          let resultSet = await(await query.execute()).allResults(); 
          setResultsCount(resultSet.length.toString());
          for (let result of resultSet){
            setResultsMessage(prev => [...prev, JSON.stringify(result)]);
          }
          } catch (e) {
            setResultsMessage(prev => [...prev, 'Error Data Validation: ' + e]);
          }
        }
      } else {
        setResultsMessage(['Error: Database is null or query is not selected']);
      }
    } else {
      setResultsMessage(['Error: Database is not setup (defined)']);
    }
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
              {queries.map(query => (
                <IonSelectOption key={query} value={query}>
                  {query}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </>
      }
      resultsChildren={
        <>
          {resultsMessage.map((message, index) => (
            <IonItem key={index} className="wrap-text">
              <IonLabel className="wrap-text">{message}</IonLabel>
            </IonItem>
          ))}
        </>
      }
    ></DetailPageContainerItemResults>
  );
};
export default QueryBuilderPage;
