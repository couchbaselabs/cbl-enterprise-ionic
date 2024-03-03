// DocumentIdForm.tsx
import React from 'react';

import {
  IonButton,
  IonItemGroup,
  IonItemDivider,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
} from '@ionic/react';

export type DocumentIdFormType = {
  setDatabaseName: (arg: string) => void;
  databaseName: string;
  setDocumentId: (arg: string) => void;
  documentId: string;
  buttonName: string;
  reset: () => void;
  update: () => void;
  resultsMessage: string;
};

const DocumentIdForm: React.FC<DocumentIdFormType> = ({
  setDatabaseName,
  databaseName,
  setDocumentId,
  documentId,
  buttonName,
  update,
  reset,
  resultsMessage,
}) => {
  return (
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
        {buttonName}
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
  );
};

export default DocumentIdForm;
