// ReplicatorConfigGeneralForm.tsx
import React from 'react';

import {
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToggle
} from '@ionic/react';

import { ReplicatorType } from 'cblite';

export type ReplicatorConfigGeneralFormType = {
  connectionString: string;
  setConnectionString: (arg: string) => void;
  heartbeat: number;
  setHeartbeat: (arg: number) => void;
  selectedReplicatorType: string;
  setSelectedReplicatorType: (arg: string) => void;
  continous: boolean;
  setContinous: (arg: boolean) => void;
  selfSignCerts: boolean;
  setSelfSignedCerts: (arg: boolean) => void;
};

const ReplicatorConfigGeneralForm: React.FC<ReplicatorConfigGeneralFormType> =
  ({
    connectionString,
    setConnectionString,
    heartbeat,
    setHeartbeat,
    selectedReplicatorType,
    setSelectedReplicatorType,
    continous,
    setContinous,
    selfSignCerts,
    setSelfSignedCerts,
  }) => {
    return (
      <>
        <IonItem key={'connection-string-item-key'}>
          <IonTextarea
            key={'connection-string-textarea-key'}
            rows={3}
            placeholder="Connection String"
            onInput={(e: any) => setConnectionString(e.target.value)}
            value={connectionString}
          ></IonTextarea>
        </IonItem>
        <IonItem key={'heartbeat-item-key'}>
          <IonLabel position="stacked" key={'heartbeat-label-key'}>
            Heartbeat (in seconds)
          </IonLabel>
          <IonInput
            key={'heartbeat-input-key'}
            type="number"
            onInput={(e: any) => setHeartbeat(e.target.value)}
            value={heartbeat}
          ></IonInput>
        </IonItem>
        <IonItem key={'replicatortype-item-key'}>
          <IonLabel key={'replicator-type-label-key'}>Replicator Type</IonLabel>
          <IonSelect
            key={'replicator-type-select-key'}
            value={selectedReplicatorType}
            onIonChange={e => setSelectedReplicatorType(e.detail.value)}
          >
            {Object.entries(ReplicatorType).map(([key, value]) => (
              <IonSelectOption key={'selectoption' + value} value={key}>
                {value}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem key={'continous-item-key'}>
          <IonToggle
            key={'continuous-toggle-key'}
            onIonChange={(e: any) => setContinous(e.detail.checked)}
            checked={continous}
          >
            Continuous
          </IonToggle>
        </IonItem>
        <IonItem key={'selfcert-item-key'}>
          <IonToggle
            key={'selfcert-toggle-key'}
            onIonChange={(e: any) => setSelfSignedCerts(e.detail.checked)}
            checked={selfSignCerts}
          >
            Accept Only Self-Signed Certs
          </IonToggle>
        </IonItem>
      </>
    );
  };

export default ReplicatorConfigGeneralForm;
