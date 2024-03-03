// DocumentMenuItems.tsx
import { IonIcon, IonItem, IonLabel, IonItemDivider } from '@ionic/react';

import React from 'react';

import { documentText, documentTextOutline } from 'ionicons/icons';

import '../Menu.css';

const DatabaseMenuItems: React.FC = () => {
  return (
    <>
     <IonItemDivider>
      <IonIcon
          aria-hidden="true"
          slot="start"
          ios={documentTextOutline}
          md={documentText}
        />
        <IonLabel style={{ marginLeft: 20}}>Document API</IonLabel>
     </IonItemDivider>
      <IonItem
        lines="none"
        style={{ marginLeft: 20 }}
        routerLink="/documents/create"
        routerDirection="none"
      >
        <IonLabel>Create</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        style={{ marginLeft: 20 }}
        routerLink="/documents/get"
        routerDirection="none"
      >
        <IonLabel>Get</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        style={{ marginLeft: 20 }}
        routerLink="/documents/update"
        routerDirection="none"
      >
        <IonLabel>Update</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        style={{ marginLeft: 20 }}
        routerLink="/documents/delete"
        routerDirection="none"
      >
        <IonLabel>Delete</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        style={{ marginLeft: 20 }}
        routerLink="/documents/change"
        routerDirection="none"
      >
        <IonLabel>Listen to Changes</IonLabel>
      </IonItem>

      <IonItem
        lines="none"
        style={{ marginLeft: 20 }}
        routerLink="/documents/blob/create"
        routerDirection="none"
      >
        <IonLabel>Create Blob</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        style={{ marginLeft: 20 }}
        routerLink="/documents/blob/get"
        routerDirection="none"
      >
        <IonLabel>Get Blob</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        style={{ marginLeft: 20 }}
        routerLink="/documents/blob/delete"
        routerDirection="none"
      >
        <IonLabel>Delete Blob</IonLabel>
      </IonItem>
    </>
  );
};
export default DatabaseMenuItems;
