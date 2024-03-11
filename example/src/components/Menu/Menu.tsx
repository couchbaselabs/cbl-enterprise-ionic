// Menu.tsx
import React from 'react';

import {
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
  DatabaseMenuItems,
  DocumentMenuItems,
  QueryMenuItems,
  IndexMenuItems,
  LoggingMenuItems,
  ReplicationMenuItems
} from './NavigationMenu/';

import './Menu.css';

const Menu: React.FC = () => {
  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>CBLite API</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonMenuToggle autoHide={false}>
          <LoggingMenuItems />
          <DatabaseMenuItems />
          <DocumentMenuItems />
          <IndexMenuItems />
          <QueryMenuItems />
          <ReplicationMenuItems />
        </IonMenuToggle>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;