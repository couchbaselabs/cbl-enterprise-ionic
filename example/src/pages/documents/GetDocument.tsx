// GetDocument.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';

import v4 from 'couchbase-lite-ee-ionic';

import {
	IonButton,
	IonItemGroup,
	IonItemDivider,
	IonList,
	IonItem,
	IonInput,
	IonLabel,
  } from '@ionic/react';

const GetDocumentPage: React.FC = () => {
  const { databases, setDatabases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');


  function reset() {
    setDatabaseName('');
    setDocumentId('');
    setResultsMessage('');
  }

  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        db.getDocument(documentId)
          .then((doc: any) => {
            if (doc != null) {
              setResultsMessage('Document Found: ' + JSON.stringify(doc));
            } else {
              setResultsMessage('Error: Document not found');
            }
          })
          .catch((error: string) => {
            setResultsMessage(error);
          });
      }
    } else {
      setResultsMessage('Error: Database is not setup (defined)');
    }
  }

  return (
    <DetailPageContainer 
    navigationTitle="Get Document" collapseTitle="Get Document">
      <IonList>
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
        <IonItemDivider>
          <IonLabel>Document Information</IonLabel>
        </IonItemDivider>
        <IonItem key={1}>
          <IonInput
            onInput={(e: any) => setDocumentId(e.target.value)}
            placeholder="Document ID"
            value={documentId}
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
          Get
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


export default GetDocumentPage;