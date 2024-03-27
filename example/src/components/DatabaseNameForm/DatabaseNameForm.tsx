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
        <IonItemDivider key="database-divider-key">
          <IonLabel key="database-label-key">Database</IonLabel>
        </IonItemDivider>
        <IonItem key="database-item-key">
          <IonInput
            key="database-input-key"
            onInput={(e: any) => setDatabaseName(e.target.value)}
            placeholder="Database Name"
            value={databaseName}
          ></IonInput>
        </IonItem>
     </>
	);
}; 

export default DatabaseNameForm;