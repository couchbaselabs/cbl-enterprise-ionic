// CreateDocument.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import { DataGeneratorService } from '../../services/DataGeneratorService';

import {
	IonButton,
	IonItemGroup,
	IonItemDivider,
	IonList,
	IonItem,
	IonInput,
	IonLabel,
  IonTextarea,
  generateId
  } from '@ionic/react';
import { MutableDocument } from 'couchbase-lite-ee-ionic';

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

  function generate() {
    let ds = new DataGeneratorService(); 
    let data = ds.getRandomDocument();
    setDocumentId(data.id);
    setDocument(JSON.stringify(data.doc));
  }

  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        //create a mutable document to save into the database
        let doc = new MutableDocument(documentId);
        doc.setData(JSON.parse(document));

        db.save(doc)
          .then(() => {
            if (documentId in db._documents) {
              setResultsMessage('Document Created');
            } else {
              let message = 'Error: Id not found in _documents ' + documentId;
              setResultsMessage(message);
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
    navigationTitle="Save Document" collapseTitle="Save Document">
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
        <IonItem key={2} lines="full">
          <IonLabel position="stacked">Document</IonLabel>
          <textarea 
            rows={4}
            value={document}
            onChange={(e: any) => setDocument(e.detail.value)} 
            placeholder="{ 'message': 'hello world' }">
          </textarea>
        </IonItem>
        <IonButton
          onClick={update}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '20px 80px 5px 80px',
          }}
        >
          Save 
        </IonButton>
        <IonButton
          onClick={generate}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '10px 80px',
          }}
        >
          Generate 
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