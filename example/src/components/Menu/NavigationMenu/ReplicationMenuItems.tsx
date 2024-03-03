// ReplicationMenuItems.tsx
import React from 'react';

import { IonIcon, IonItem, IonLabel, IonItemDivider } from '@ionic/react';

import { infinite,
	infiniteOutline } from 'ionicons/icons';

import '../Menu.css';

const ReplicationMenuItems: React.FC = () => {
  return (
    <>
   <IonItemDivider>
      <IonIcon
          aria-hidden="true"
          slot="start"
          ios={infiniteOutline}
          md={infinite}
        />
        <IonLabel style={{ marginLeft: 20}}>Replication API</IonLabel>
     </IonItemDivider>
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
