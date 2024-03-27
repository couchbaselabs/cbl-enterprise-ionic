// DatabaseOpen.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import {
  IonButton,
  IonItem,
  IonInput,
  IonItemDivider,
  IonLabel,
} from '@ionic/react';

import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';

//import the database in order to create/open a database
import { 
  Database, 
  DatabaseConfiguration, 
  FileSystem 
} from 'cblite';

const DatabaseSetupPage: React.FC = () => {
  const { databases, setDatabases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function reset() {
    setDatabaseName('');
    setPath('');
    setEncryptionKey('');
    setResultsMessage('');
  }

  function platformPath() {
    const pd = new FileSystem();
    pd.getDefaultPath().then((result: string) => {
      setPath(result);
    });
  }

  function update() {
    if (databaseName in databases) {
      setResultsMessage('Error: Database is already setup');
    } else {
      let db: Database;
      if (path !== '' || encryptionKey !== '') {
        let config = new DatabaseConfiguration();
        if (path !== '') {
          config.setDirectory(path);
        }
        if (encryptionKey !== '') {
          config.setEncryptionKey(encryptionKey);
        }
        db = new Database(databaseName, config);
      } else {
        db = new Database(databaseName);
      }
      if (db !== null) {
        setDatabases(prevState => ({
          ...prevState,
          [databaseName]: db,
        }));
        setResultsMessage('success');
      } else {
        setResultsMessage('Error: Database is null');
      }
    }
  }

  return (
    <DetailPageContainer
      navigationTitle="Database Setup"
      collapseTitle="Define Database"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Setup"
    >
      <IonItemDivider>
        <IonLabel>Database</IonLabel>
      </IonItemDivider>
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
          onInput={(e: any) => setPath(e.target.value)}
          value={path}
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
        onClick={platformPath}
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '10px 80px 5px 80px',
        }}
      >
        Default Platform Directory
      </IonButton>
    </DetailPageContainer>
  );
};

export default DatabaseSetupPage;
