// CreateDocument.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';

import {
	IonButton,
	IonItemGroup,
	IonItemDivider,
	IonList,
	IonItem,
	IonInput,
	IonLabel,
  IonTextarea
  } from '@ionic/react';

const CreateDocumentPage: React.FC = () => {
  const { databases, setDatabases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');
  const [document, setDocument] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function reset() {
    setDatabaseName('');
    setDocumentId('');
    setDocument('');
    setResultsMessage('');
  }

  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        setResultsMessage('Error: Not Implented');
      }
    } else {
      setResultsMessage('Error: Database is not setup (defined)');
    }
  }

  return (
    <DetailPageContainer 
    navigationTitle="Create Document" collapseTitle="Create Document">
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
        <IonItem key={2}>
        <IonLabel position="stacked">Document</IonLabel>
          <IonTextarea placeholder="{ 'message': 'hello world' }"></IonTextarea>
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
          Create 
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

export default CreateDocumentPage;