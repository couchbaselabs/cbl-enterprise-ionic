// PerformMaintenance.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';

import {
  IonButton,
  IonItemGroup,
  IonItemDivider,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

//import the database in order to create/open a database
import { Database } from 'couchbase-lite-ee-ionic';

const PerformMaintenancePage: React.FC = () => {
  const { databases, setDatabases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [selectedMaintenanceJob, setSelectedMaintenanceJob] =
    useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');
  const maintenanceJobs = ['Compact', 'Reindex', 'IntegrityCheck', 'Optimize', 'Full Optimize'];

  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        switch(selectedMaintenanceJob){
          case "Compact":
            db.compact()
            .then(() => {
              setResultsMessage('success');
            })
            .catch((error: unknown) => {
              setResultsMessage('' + error);
            });
            break;
          case "Reindex":
            setResultsMessage('Error: not implemented yet in plugin.');
            break;
          case "IntegrityCheck":
            setResultsMessage('Error: not implemented yet in plugin.');
            break;
          case "Optimize":
            setResultsMessage('Error: not implemented yet in plugin.');
            break;
          case "Full Optimize":
            setResultsMessage('Error: not implemented yet in plugin.');
            break;
          default:
              setResultsMessage('Error: Maintenance job not found.');
              break;
          }
      }
    } else {
      setResultsMessage('Error: can not find database.');
    }
  }

  function reset() {
    setDatabaseName('');
    setResultsMessage('');
  }

  return (
    <DetailPageContainer
      navigationTitle="Database Maintenance"
      collapseTitle="Database Maintenance"
    >
      <IonList>
        <IonItem key={0}>
          <IonInput
            onInput={(e: any) => setDatabaseName(e.target.value)}
            placeholder="Database Name"
            value={databaseName}
          ></IonInput>
        </IonItem>
        <IonItem key={1}>
          <IonLabel>Maintenance Jobs</IonLabel>
          <IonSelect
            value={selectedMaintenanceJob}
            onIonChange={e => setSelectedMaintenanceJob(e.detail.value)}
          >
            {maintenanceJobs.map(value => (
              <IonSelectOption value={value}>{value}</IonSelectOption>
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
          Run 
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
          <IonItem key={2}>
            <IonLabel>{resultsMessage}</IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </DetailPageContainer>
  );
};

export default PerformMaintenancePage;
