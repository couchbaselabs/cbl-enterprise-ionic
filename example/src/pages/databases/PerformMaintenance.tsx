// PerformMaintenance.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import {
  IonItem,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

const PerformMaintenancePage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
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
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Run">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
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
    </DetailPageContainer>
  );
};

export default PerformMaintenancePage;
