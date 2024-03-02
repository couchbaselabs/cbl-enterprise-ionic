// DatabaseDelete.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import {
  IonButton,
  IonItemGroup,
  IonItemDivider,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
} from '@ionic/react';

import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';
import { Database } from '../../../../dist/esm';

const DatabaseDeletePage: React.FC = () => {
  const { databases, setDatabases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function reset() {
    setDatabaseName('');
    setResultsMessage('');
  }
  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        db.deleteDatabase()
          .then(() => {
            setDatabases(prevState => {
              //after closing the database remove it from the provider
              const newState = { ...prevState };
              delete newState[databaseName];
              return newState;
            });
            setResultsMessage('success');
          })
          .catch((error: unknown) => {
            setResultsMessage('' + error);
          });
      }
    } else {
      setResultsMessage('Error: Database not found');
    }
  }

  return (
    <DetailPageContainer 
    navigationTitle="Database Delete" collapseTitle="Database Delete">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
        buttonName="Delete"
        update={update}
        reset={reset}
        resultsMessage={resultsMessage} 
      ></DatabaseNameForm>
    </DetailPageContainer>
  );
};

export default DatabaseDeletePage;