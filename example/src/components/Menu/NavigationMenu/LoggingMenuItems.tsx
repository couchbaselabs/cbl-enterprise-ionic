// QueryMenuItems.tsx
import { IonIcon, IonItem, IonLabel } from '@ionic/react';

import React from 'react';

import { informationCircle, informationCircleOutline } from 'ionicons/icons';

import '../Menu.css';

const LoggingMenuItems: React.FC = () => {
  return (
    <>
      <IonItem className="menuRoot">
        <IonIcon
          aria-hidden="true"
          slot="start"
          ios={informationCircleOutline}
          md={informationCircle}
        />
        <IonLabel>Logging API</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/log/console"
        routerDirection="none"
      >
        <IonLabel>Console</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/log/file"
        routerDirection="none"
      >
        <IonLabel>File</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/log/custom"
        routerDirection="none"
      >
        <IonLabel>Custom</IonLabel>
      </IonItem>
    </>
  );
};
export default LoggingMenuItems;
