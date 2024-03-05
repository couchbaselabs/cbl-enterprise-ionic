import React from 'react';
import {
	IonItem,
	IonInput,
  IonItemDivider,
  IonLabel
  } from '@ionic/react';

export type DatabaseNameFormType = {
	setDatabaseName: (arg: string) => void;
	databaseName: string;
};

const DatabaseNameForm: React.FC<DatabaseNameFormType> = ({
  setDatabaseName, 
  databaseName }) => {
	return (
      <>
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
     </>
	);
}; 

export default DatabaseNameForm;