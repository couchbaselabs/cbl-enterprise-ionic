// IndexMenuItems.tsx
import { IonIcon, IonItem, IonLabel } from '@ionic/react';

import React from 'react';

import { search, searchOutline } from 'ionicons/icons';

import '../Menu.css';

const IndexMenuItems: React.FC = () => {
  return (
    <>
      <IonItem className="menuRoot">
        <IonIcon
          aria-hidden="true"
          slot="start"
          ios={searchOutline}
          md={search}
        />
        <IonLabel>Index API</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/index/create"
        routerDirection="none"
      >
        <IonLabel>Create</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/index/createFTS"
        routerDirection="none"
      >
        <IonLabel>Create FTS</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/index/delete"
        routerDirection="none"
      >
        <IonLabel>Delete</IonLabel>
      </IonItem>
	  <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/index/list"
        routerDirection="none"
      >
        <IonLabel>List</IonLabel>
      </IonItem>
    </>
  );
};
export default IndexMenuItems;