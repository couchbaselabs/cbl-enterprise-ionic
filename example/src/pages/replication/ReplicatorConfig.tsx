// Replicator.tsx
import React, 
{ 
  useState, 
  useContext 
} from 'react';

import DatabaseContext from '../../providers/DatabaseContext';

import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';
import ReplicatorConfigGeneralForm from '../../components/ReplicatorConfigGeneralForm/ReplicatorConfigGeneralForm';
import AuthenticationTwoFieldForm from '../../components/AuthenticationTwoFieldForm/AuthenticationTwoFieldForm';
import ReplicatorChannelsEditorForm from '../../components/ReplicatorChannelsEditor/ReplicatorChannelsEditor';

import { 
  IonItem, 
  IonLabel, 
  IonSegment, 
  IonSegmentButton 
} from '@ionic/react';

const ReplicatorConfigPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');

  //used to track the state of the configuration section to show
  const [selectedSegment, setSelectedSegment] = useState<string>('general');

  //used for general configuration fields
  const [connectionString, setConnectionString] = useState<string>('');
  const [selectedReplicatorType, setSelectedReplicatorType] =
    useState<string>('');
  const [heartbeat, setHeartbeat] = useState<number>(60);
  const [continous, setContinous] = useState<boolean>(true);
  const [selfSignedCerts, setSelfSignedCerts] = useState<boolean>(true);

  //used for authentication type and authentication fields
  const [selectedAuthenticationType, setSelectedAuthenticationType] =
    useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [cookieName, setCookieName] = useState<string>('');

  //used for channels configuration
  const [channels, setChannels] = useState<string>('');

  const [resultsMessage, setResultsMessage] = useState<string[]>([]);

  function update() {

  }

  function reset() {
    setDatabaseName('');
    setSelectedAuthenticationType('');
    setSelectedSegment('general');
    setUsername('');
    setPassword('');
    setConnectionString('');
    setHeartbeat(60);
    setSelectedReplicatorType('');
    setContinous(true);
    setSelfSignedCerts(true);
    setResultsMessage([]);
    setChannels('');
  }

  return (
    <DetailPageContainerRun
      navigationTitle="Replicator Config"
      collapseTitle="Replicator Config"
      onReset={reset}
      onAction={update}
      databaseName={databaseName}
      setDatabaseName={setDatabaseName}
      sectionTitle="Replicator Config"
      titleButtons={null}
      children={
        <>
          <IonSegment className="mt-4 mb-4" value={selectedSegment}
          onIonChange={e => setSelectedSegment(e.detail.value.toString())}>
            <IonSegmentButton value="general">
              <IonLabel>General</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="authentication">
              <IonLabel>Authentication</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="channels">
              <IonLabel>Channels</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          {(() => {
  switch (selectedSegment) {
    case 'general':
      return (
        <ReplicatorConfigGeneralForm
          connectionString={connectionString}
          setConnectionString={setConnectionString}
          heartbeat={heartbeat}
          setHeartbeat={setHeartbeat}
          selectedReplicatorType={selectedReplicatorType}
          setSelectedReplicatorType={setSelectedReplicatorType}
          continous={continous}
          setContinous={setContinous}
          selfSignCerts={selfSignedCerts}
          setSelfSignedCerts={setSelfSignedCerts}
        />
      );
    case 'authentication':
      return <AuthenticationTwoFieldForm
      selectedAuthenticationType={selectedAuthenticationType}
      setSelectedAuthenticationType={setSelectedAuthenticationType}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      sessionId={sessionId}
      setSessionId={setSessionId}
      cookieName={cookieName}
      setCookieName={setCookieName}>
      </AuthenticationTwoFieldForm>
    case 'channels':
      return <ReplicatorChannelsEditorForm
        channels={channels}
        setChannels={setChannels}> 
      </ReplicatorChannelsEditorForm>
    default:
      return null;
      }})()}
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
