// Menu.tsx
import { IonIcon, IonItem, IonLabel } from '@ionic/react';

import React from 'react';

import { server, serverOutline } from 'ionicons/icons';

import '../Menu.css';

const DatabaseMenuItems: React.FC = () => {
  return (
    <>
      <IonItem>
        <IonIcon
          aria-hidden="true"
          slot="start"
          ios={serverOutline}
          md={server}
        />
        <IonLabel>Database API</IonLabel>
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