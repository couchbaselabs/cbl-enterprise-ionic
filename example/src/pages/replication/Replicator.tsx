// Replicator.tsx
import React, { 
  useState, 
  useContext 
} from 'react';

import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import { ReplicatorType } from 'cblite';

import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToggle,
} from '@ionic/react';

const ReplicatorPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [connectionString, setConnectionString] = useState<string>('');
  const [selectedReplicatorType, setSelectedReplicatorType] = useState<string>('');
  const [heartbeat, setHeartbeat] = useState<number>(60);
  const [continous, setContinous] = useState<boolean>(true);
  const [selfSignCerts, setSelfSignedCerts] = useState<boolean>(true);
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  function stop () {

  }

  function start() {

  }

  function update() {

  }

  function reset() {
    setDatabaseName('');
    setResultsMessage([]);
  }

  return (
    <DetailPageContainerRun
    navigationTitle="Replicator"
    collapseTitle="Replicator"
    onReset={reset}
    onAction={start}
    databaseName={databaseName}
    setDatabaseName={setDatabaseName}
    sectionTitle="Replicator Config"
    titleButtons={
      <>
      <IonButton
      key="button-save-key"
      onClick={update}
      style={{
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0px 2px 0px 25px',
      }}
    >
    <i className="fa-solid fa-floppy-disk-circle-arrow-right"></i>
    </IonButton>
      <IonButton
        key="button-stop-key"
        onClick={stop}
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '0px 2px 0px 25px',
        }}
      >
        <i className="fa-solid fa-stop"></i>
      </IonButton>
      </>
    }
    children={
      <>
        <IonItem key={'connection-string-item-key'}>
          <IonTextarea
            key={'connection-string-textarea-key'}
            rows={6}
            placeholder="Connection String"
            onInput={(e: any) => setConnectionString(e.detail.value)}
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
    }
    resultsChildren={resultsMessage.map((message, index) => (
      <IonItem key={'message-' + index}>
        <IonLabel>{message}</IonLabel>
      </IonItem>
    ))}
  ></DetailPageContainerRun>
  );
};

export default ReplicatorPage;