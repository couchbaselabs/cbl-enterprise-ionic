// DatabaseOpen.tsx
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

//import the database in order to create/open a database
import { Database, DatabaseConfiguration } from 'couchbase-lite-ee-ionic';

const DatabaseOpenPage: React.FC = () => {
  const { databases, setDatabases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [fileLocation, setFileLocation] = useState<string>('');
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function reset() {
    setDatabaseName('');
    setFileLocation('');
    setEncryptionKey('');
    setResultsMessage('');
  }

  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        db.open()
          .then(() => {
            setResultsMessage('success');
          })
          .catch((error: unknown) => {
            setResultsMessage('' + error);
          });
      }
    } else {
        setResultsMessage('Error: Database is not setup (defined)');
    }
  }

  return (
    <DetailPageContainer
      navigationTitle="Database Open"
      collapseTitle="Open"
    >
      <IonList>
        <IonItem key={0}>
          <IonInput
            onInput={(e: any) => setDatabaseName(e.target.value)}
            placeholder="Database Name"
            value={databaseName}
          ></IonInput>
        </IonItem>
        <IonItem key={1}>
          <IonInput
            placeholder="File Location"
            onInput={(e: any) => setFileLocation(e.target.value)}
            value={fileLocation}
          ></IonInput>
        </IonItem>
        <IonItem key={2}>
          <IonInput
            onInput={(e: any) => setEncryptionKey(e.target.value)}
            placeholder="Encryption Key"
            value={encryptionKey}
          ></IonInput>
        </IonItem>
        <IonButton
          onClick={update}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '20px 80px',
          }}
        >
          Open
        </IonButton>
        <IonButton
          onClick={reset}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '5px 80px',
          }}
        >
          Reset
        </IonButton>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Results</IonLabel>
          </IonItemDivider>
          <IonItem>
            <IonLabel>{resultsMessage}</IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </DetailPageContainer>
  );
};

export default DatabaseOpenPage;
