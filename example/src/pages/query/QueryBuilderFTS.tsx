// QueryBuilderFTS.tsx
import './QueryBuilder.css';
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerItemResults from '../../components/DetailPageContainerItemResults/DetailPageContainerItemResults';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import {
  IonItemDivider,
  IonLabel,
  IonButton,
  IonButtons,
  IonInput,
  IonIcon,
  IonItem,
} from '@ionic/react';

import { playOutline } from 'ionicons/icons';

import {
  FullTextExpression,
  QueryBuilder,
  SelectResult,
  DataSource,
  ResultSet,
  Result,
} from 'cblite';

const QueryBuilderPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [indexName, setIndexName] = useState<string>('');
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);
  const [resultsCount, setResultsCount] = useState<string>('');

  async function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        if (indexName.length > 0 && propertyValue.length > 0) {
          //create query
          let whereClause =
            FullTextExpression.index(indexName).match(propertyValue);
          let ftsQuery = QueryBuilder.select(SelectResult.all())
            .from(DataSource.database(db))
            .where(whereClause);

          //execute the query - unwrap this below
          ftsQuery
            .execute()
            .then((resultSet: ResultSet) => {
              return resultSet.allResults();
            })
            .then((queryResults: Result[]) => {
              //loop through results
              if (queryResults.length === 0) {
                setResultsMessage(['success - no records found']);
              } else {
                setResultsCount(': ' + queryResults.length.toString());
                setResultsMessage([]);
                for (let r of queryResults) {
                  let str = JSON.stringify(r);
                  setResultsMessage(prev => [...prev, str]);
                }
              }
            })
            .catch((error: unknown) => {
              setResultsMessage(['' + error]);
            });
        } else {
          setResultsMessage([
            'Error: Property Name or Property Value not defined',
          ]);
        }
      } else {
        setResultsMessage(['Error: Index name or field is not defined']);
      }
    } else {
      setResultsMessage(prev => ['Error: Database is not setup (defined)']);
    }
  }

  function reset() {
    setDatabaseName('');
    setIndexName('');
    setPropertyValue('');
    setResultsMessage([]);
  }

  return (
    <DetailPageContainerItemResults
      navigationTitle="Query Builder FTS"
      collapseTitle="Query Builder FTS"
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
            <IonInput
              onInput={(e: any) => setIndexName(e.target.value)}
              placeholder="FTS Index Name"
              value={indexName}
            ></IonInput>
          </IonItem>
          <IonItem key={3}>
            <IonInput
              onInput={(e: any) => setPropertyValue(e.target.value)}
              placeholder="Value to Search"
              value={propertyValue}
            ></IonInput>
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
