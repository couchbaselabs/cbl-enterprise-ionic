// QueryMenuItems.tsx
import { IonIcon, IonItem, IonLabel } from '@ionic/react';

import React from 'react';

import { pencil, pencilOutline } from 'ionicons/icons';

import '../Menu.css';

const QueryMenuItems: React.FC = () => {
  return (
    <>
      <IonItem className="menuRoot">
        <IonIcon
          aria-hidden="true"
          slot="start"
          ios={pencilOutline}
          md={pencil}
        />
        <IonLabel>Query API</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/query/sqlPlusPlus"
        routerDirection="none"
      >
        <IonLabel>SQL++</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/query/queryBuilder"
        routerDirection="none"
      >
        <IonLabel>Query Builder</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/query/liveQuery"
        routerDirection="none"
      >
        <IonLabel>Live Query</IonLabel>
      </IonItem>
    </>
  );
};
export default QueryMenuItems;