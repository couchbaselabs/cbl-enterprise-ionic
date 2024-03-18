// Replicator.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel } from '@ionic/react';

const ReplicatorPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update() {

  }

  function reset() {

  }

  return (
    <DetailPageContainer 
    navigationTitle="Replicator" collapseTitle="Replicator"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Update">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName} />
      <IonItemDivider>
        <IonLabel>Replicator</IonLabel>
      </IonItemDivider>
    </DetailPageContainer>
  );
};

export default ReplicatorPage;