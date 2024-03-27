// Menu.tsx
import { IonItem, IonLabel, IonItemDivider } from '@ionic/react';

import React from 'react';

import '../Menu.css';

const DatabaseMenuItems: React.FC = () => {
  return (
    <>
     <IonItemDivider>
        <i className="fa-duotone fa-database"></i>
        <IonLabel style={{ marginLeft: 20}}>Database API</IonLabel>
     </IonItemDivider>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/databases/setup"
        routerDirection="none"
      >
        <IonLabel>Setup</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/databases/open"
        routerDirection="none"
      >
        <IonLabel>Open</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/databases/close"
        routerDirection="none"
      >
        <IonLabel>Close</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/databases/copy"
        routerDirection="none"
      >
        <IonLabel>Copy</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/databases/change"
        routerDirection="none"
      >
        <IonLabel>Listen to Changes</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/databases/delete"
        routerDirection="none"
      >
        <IonLabel>Delete</IonLabel>
      </IonItem>
      <IonItem
        lines="none" 
        style={{ marginLeft: 20 }}
        routerLink="/databases/maintenance"
        routerDirection="none"
      >
        <IonLabel>Perform Maintenance</IonLabel>
      </IonItem>
      
    </>
  );
};
export default DatabaseMenuItems;

/* TODO add for scopes/collection support
<IonItem
        style={{ marginLeft: 20 }}
        routerLink="/databases/createCollection"
        routerDirection="none"
      >
        <IonLabel>Create Collection</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/databases/listCollections"
        routerDirection="none"
      >
        <IonLabel>List Collections</IonLabel>
      </IonItem>
*/