// ConsoleLog.tsx
import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonItemGroup,
  IonItemDivider,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';

//import the database which has a list of log levels and domains
import { LogLevel, LogDomain, Database } from 'couchbase-lite-ee-ionic';

const ConsoleLogPage: React.FC = () => {
  //load load levels and domains from couchbase lite plugin
  const logDomains = Object.values(LogDomain);

  const [selectedLogLevel, setSelectedLogLevel] = useState<string>('');
  const [selectedLogDomain, setSelectedLogDomain] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function reset() {
    setSelectedLogLevel('');
    setSelectedLogDomain('');
    setResultsMessage('');
  }

  function update() {
    //get the log level and domain from selected values back into enum form
    let logKey = null;
    if (selectedLogLevel !== '')
    {
      logKey = parseInt(selectedLogLevel);
    }
    let logDomain = LogDomain[selectedLogDomain as keyof typeof LogDomain];
    let logLevel: LogLevel | null = logKey;

    //the plugin currently requires a database to get the engine set in order to set the log level.  This should be static, but that would cause an issue because then the engine isn't defined.  For now, we'll just create a new database and set the log level on it, but note that the log level is for all databases, not just this one.
    let db = new Database('test');
    db.setLogLevel(logDomain, logLevel)
      .then(() => {
        setResultsMessage('success');
      })
      .catch((error: unknown) => {
        setResultsMessage('' + error);
      });
  }

  return (
    <DetailPageContainer
      navigationTitle="Console Log"
      collapseTitle="Console Log"
    >
      <IonList>
        <IonItem key={0}>
          <IonLabel>Select a Log Domain</IonLabel>
          <IonSelect
            value={selectedLogDomain}
            onIonChange={e => setSelectedLogDomain(e.detail.value)}
          >
            {logDomains.map(domain => (
              <IonSelectOption value={domain}>{domain}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem key={1}>
          <IonLabel>Select a Log Level</IonLabel>
          <IonSelect
            value={selectedLogLevel}
            onIonChange={e => setSelectedLogLevel(e.detail.value)}
          >
            {Object.entries(LogLevel).map(([key, value]) => (
              <IonSelectOption value={key}>{value}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonButton
          onClick={update}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '20px 80px',
          }}
        >
          Update
        </IonButton>
        <IonButton
          onClick={reset}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '5px 80px',
          }}
        >
          Reset 
        </IonButton>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Results</IonLabel>
          </IonItemDivider>
          <IonItem>
            <IonLabel>{resultsMessage}</IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </DetailPageContainer>
  );
};

export default ConsoleLogPage;
