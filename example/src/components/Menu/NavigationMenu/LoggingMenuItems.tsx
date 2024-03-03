// QueryMenuItems.tsx
import { IonIcon, IonItem, IonLabel, IonItemDivider } from '@ionic/react';

import React from 'react';

import { informationCircle, informationCircleOutline } from 'ionicons/icons';

import '../Menu.css';

const LoggingMenuItems: React.FC = () => {
  return (
    <>
    <IonItemDivider>
      <IonIcon
          aria-hidden="true"
          slot="start"
          ios={informationCircleOutline}
          md={informationCircle}
        />
        <IonLabel style={{ marginLeft: 20}}>Logging API</IonLabel>
     </IonItemDivider>
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
