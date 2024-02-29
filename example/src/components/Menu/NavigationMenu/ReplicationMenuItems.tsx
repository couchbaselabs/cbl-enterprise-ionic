// ReplicationMenuItems.tsx
import React from 'react';

import { IonIcon, IonItem, IonLabel } from '@ionic/react';

import { infinite,
	infiniteOutline } from 'ionicons/icons';

import '../Menu.css';

const ReplicationMenuItems: React.FC = () => {
  return (
    <>
      <IonItem className="menuRoot">
        <IonIcon
          aria-hidden="true"
          slot="start"
          ios={infiniteOutline}
          md={infinite}
        />
        <IonLabel>Replication API</IonLabel>
      </IonItem>
      <IonItem
        style={{ marginLeft: 20 }}
        routerLink="/replication/replicator"
        routerDirection="none"
      >
        <IonLabel>Replicator</IonLabel>
      </IonItem>
    </>
  );
};
export default ReplicationMenuItems;
