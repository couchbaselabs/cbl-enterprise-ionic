// Replicator.tsx
import React, { 
  useState, 
  useContext, 
  useRef, 
  useEffect 
} from 'react';

import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import { ReplicatorType } from 'cblite';

import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonToggle,
  IonItemDivider,
} from '@ionic/react';

import { OverlayEventDetail } from '@ionic/core/components';

const ReplicatorConfigPage: React.FC = () => {
  //modal for selection authentication type and fields
  const modal = useRef<HTMLIonModalElement>(null);
  const selectAuthType = useRef<HTMLIonSelectElement>(null);
  const inputOne = useRef<HTMLIonInputElement>(null);
  const inputTwo = useRef<HTMLIonInputElement>(null);

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [connectionString, setConnectionString] = useState<string>('');
  const [selectedReplicatorType, setSelectedReplicatorType] =
    useState<string>('');
  const [heartbeat, setHeartbeat] = useState<number>(60);
  const [continous, setContinous] = useState<boolean>(true);
  const [selfSignCerts, setSelfSignedCerts] = useState<boolean>(true);
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  //used for authentication type and authentication fields
  const [selectedAuthenticationType, setSelectedAuthenticationType] =
    useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [cookieName, setCookieName] = useState<string>('');

  useEffect(() => {
    if (selectAuthType.current) {
      setSelectedAuthenticationType(selectAuthType.current.value);
      if (selectAuthType.current.value === 'basic') {
        inputOne.current?.setAttribute('label', 'Username');
        inputOne.current?.setAttribute('placeholder', 'Username');
        inputTwo.current?.setAttribute('label', 'Password');
        inputTwo.current?.setAttribute('placeholder', 'Password');
      } else {
        inputOne.current?.setAttribute('label', 'SessionId');
        inputOne.current?.setAttribute('placeholder', 'SessionId');
        inputTwo.current?.setAttribute('label', 'Cookie');
        inputTwo.current?.setAttribute('placeholder', 'Cookie');
      }
    }
  }, [selectAuthType.current?.value]);

  function modelConfirm() {
    modal.current?.dismiss(
      {
        oneValue: inputOne.current?.value,
        twoValue: inputTwo.current?.value,
      },
      'confirm',
    );
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      //todo set to state for oneValue and twoValue
      if (selectedAuthenticationType === 'basic') {
        setUsername(ev.detail.data.oneValue);
        setPassword(ev.detail.data.twoValue);
      } else {
        setSessionId(ev.detail.data.oneValue);
        setCookieName(ev.detail.data.twoValue);
      }
    }
  }
  function openModal() {
    setSelectedAuthenticationType(''); //reset
  }

  function stop() {}

  function start() {}

  function update() {}

  function reset() {
    setDatabaseName('');
    setSelectedAuthenticationType('');
    setUsername('');
    setPassword('');
    setConnectionString('');
    setHeartbeat(60);
    setSelectedReplicatorType('');
    setContinous(true);
    setSelfSignedCerts(true);
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
            id="open-modal"
            key="button-save-key"
            onClick={openModal}
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: '0px 2px 0px 25px',
            }}
          >
            <i className="fa-solid fa-right-to-bracket"></i>
          </IonButton>
        </>
      }
      children={
        <>
          <IonModal
            ref={modal}
            trigger="open-modal"
            onWillDismiss={ev => onWillDismiss(ev)}
          >
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => modal.current?.dismiss()}>
                    Cancel
                  </IonButton>
                </IonButtons>
                <IonTitle>Set Authentication Information</IonTitle>
                <IonButtons slot="end">
                  <IonButton strong={true} onClick={() => modelConfirm()}>
                    Update
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonItem>
                <IonLabel>Authentication Type</IonLabel>
                <IonSelect
                  ref={selectAuthType}
                  key={'authentication-type-select-key'}
                  value={selectedAuthenticationType}
                  onIonChange={e =>
                    setSelectedAuthenticationType(e.detail.value)
                  }
                >
                  <IonSelectOption key={'selectoption-basic'} value="basic">Basic</IonSelectOption>
                  <IonSelectOption key={'selectoption-session'} value="session">Session</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonInput
                  label=""
                  labelPlacement="stacked"
                  ref={inputOne}
                  type="text"
                  placeholder=""
                />
              </IonItem>
              <IonItem>
                <IonInput
                  label=""
                  labelPlacement="stacked"
                  ref={inputTwo}
                  type="text"
                  placeholder=""
                />
              </IonItem>
            </IonContent>
          </IonModal>
          <IonItem key={'connection-string-item-key'}>
            <IonTextarea
              key={'connection-string-textarea-key'}
              rows={3}
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
            <IonLabel key={'replicator-type-label-key'}>
              Replicator Type
            </IonLabel>
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
          { selectedAuthenticationType !== '' ? 
          <>
          <IonItemDivider>Authentication Configuration</IonItemDivider>
          <IonItem key="authentication-type-key">
            <IonLabel>Authentication Type:   
              <span style={{
              padding: '0px 0px 0px 40px'}}>{selectedAuthenticationType}</span></IonLabel>
          </IonItem>
          </> : null }
          { selectedAuthenticationType === 'basic' ?
          <>
           <IonItem key="username-key">
            <IonLabel>Username:   
              <span style={{
              padding: '0px 0px 0px 40px'}}>{username}</span></IonLabel>
          </IonItem> 
          <IonItem key="password-key">
            <IonLabel>Password:   
              <span style={{
              padding: '0px 0px 0px 40px'}}>{password}</span></IonLabel>
          </IonItem> 
          </> : null }
          { selectedAuthenticationType === 'session' ?
          <>
           <IonItem key="session-id-key">
            <IonLabel>Session Id:   
              <span style={{
              padding: '0px 0px 0px 40px'}}>{sessionId}</span></IonLabel>
          </IonItem> 
          <IonItem key="cookie-name-key">
            <IonLabel>Cookie Name:   
              <span style={{
              padding: '0px 0px 0px 40px'}}>{cookieName}</span></IonLabel>
          </IonItem> 
          </> : null }
        </> }
      resultsChildren={resultsMessage.map((message, index) => (
        <IonItem key={'message-' + index}>
          <IonLabel>{message}</IonLabel>
        </IonItem>
      ))}
    ></DetailPageContainerRun>
  );
};

export default ReplicatorConfigPage;
