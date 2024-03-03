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

export type DatabaseNameFormType = {
	setDatabaseName: (arg: string) => void;
	databaseName: string;
	buttonName: string;
	reset: () => void;
	update: () => void;
	resultsMessage: string;
};

const DatabaseNameForm: React.FC<DatabaseNameFormType> = ({setDatabaseName, databaseName, buttonName, update, reset, resultsMessage }) => {
	return (
      <IonList>
        <IonItem key={0}>
          <IonInput
            onInput={(e: any) => setDatabaseName(e.target.value)}
            placeholder="Database Name"
            value={databaseName}
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

export default DatabaseNameForm;