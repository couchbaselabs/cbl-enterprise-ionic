// DatabaseCopy.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import {
  IonButton,
  IonItemDivider,
  IonItem,
  IonInput,
  IonLabel,
} from '@ionic/react';

import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';

//import the database in order to create/open a database
import { DatabaseConfiguration, FileSystem } from 'cblite';

const DatabaseCopyPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [currentDatabaseName, setCurrentDatabaseName] = useState<string>('');
  const [databaseName, setDatabaseName] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function reset() {
    setCurrentDatabaseName('');
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
    if (currentDatabaseName in databases) {
      let db = databases[currentDatabaseName];
      if (db != null) {
        db.getPath()
        .then((currentPath: string) => {
          let config = new DatabaseConfiguration();
          if (path !== '') {
            config.directory = path;
          }
          if (encryptionKey !== '') {
            config.encryptionKey = encryptionKey;
          }
          db.close()
            .finally(() => {
              db.copy(currentPath, databaseName, config)
                .then(() => {
                  db.open();
                  setResultsMessage('success');
                })
                .catch((error: unknown) => {
                  setResultsMessage('' + error);
                })
            })
            .catch((error: unknown) => {
              setResultsMessage('' + error);
            });
        }).catch((error: unknown) => {
          setResultsMessage('' + error);
        });
      }
    } else {
      setResultsMessage('Error: can not find current database');
    }
  }

  return (
    <DetailPageContainer
      navigationTitle="Database Copy"
      collapseTitle="Database Copy"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Copy">
        <IonItemDivider>
          <IonLabel>Current Database</IonLabel>
        </IonItemDivider>
        <IonItem key={0}>
          <IonInput
            onInput={(e: any) => setCurrentDatabaseName(e.target.value)}
            placeholder="Database Name"
            value={currentDatabaseName}
          ></IonInput>
        </IonItem>
        <IonItemDivider>
          <IonLabel>New Database</IonLabel>
        </IonItemDivider>
        <IonItem key={1}>
          <IonInput
            onInput={(e: any) => setDatabaseName(e.target.value)}
            placeholder="New Database Name"
            value={databaseName}
          ></IonInput>
        </IonItem>
        <IonItem key={2}>
          <IonInput
            placeholder="New Path"
            onInput={(e: any) => setPath(e.target.value)}
            value={path}
          ></IonInput>
        </IonItem>
        <IonItem key={3}>
          <IonInput
            onInput={(e: any) => setEncryptionKey(e.target.value)}
            placeholder="New Encryption Key"
            value={encryptionKey}
          ></IonInput>
        </IonItem>
        <IonButton
          onClick={platformPath}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '20px 80px 5px 80px',
          }}> 
          Default Platform Directory 
        </IonButton>
    </DetailPageContainer>
  );
};

export default DatabaseCopyPage;
