// QueryBuilder.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel, IonInput, IonItem } from '@ionic/react';

import {
  FullTextExpression,
  QueryBuilder,
  SelectResult,
  DataSource,
  ResultSet,
  Result
} from 'couchbase-lite-ee-ionic';

const QueryBuilderPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [indexName, setIndexName] = useState<string>('');
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

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
          //let results = await (await ftsQuery.execute()).allResults();

          ftsQuery.execute()
            .then((resultSet: ResultSet) => {
              return resultSet.allResults()
            })
            .then((queryResults: Result[]) => {
              //loop through results
              for (let r of queryResults) {
                console.log(r);
              }
            }).catch((error: unknown) => {
            setResultsMessage('' + error);
          });
        } else {
          setResultsMessage(
            'Error: Property Name or Property Value not defined',
          );
        }
      } else {
        setResultsMessage('Error: Index name or field is not defined');
      }
    } else {
      setResultsMessage('Error: Database is not setup (defined)');
    }
  }

  function reset() {
    setDatabaseName('');
    setIndexName('');
    setPropertyValue('');
    setResultsMessage('');
  }

  return (
    <DetailPageContainer
      navigationTitle="Query Builder FTS"
      collapseTitle="Query Builder FTS"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Search"
    >
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
      />
      <IonItemDivider>
        <IonLabel>Query Builder</IonLabel>
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
    </DetailPageContainer>
  );
};

export default QueryBuilderPage;
