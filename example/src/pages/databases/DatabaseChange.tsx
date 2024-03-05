// DatabaseChange.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel } from '@ionic/react';

const DatabaseChangePage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update() {}

  function reset() {}

  return (
    <DetailPageContainer
      navigationTitle="Database Change"
      collapseTitle="Database Change"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Listen"
    >
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
      />
      <IonItemDivider>
        <IonLabel>Database Change</IonLabel>
      </IonItemDivider>
    </DetailPageContainer>
  );
};

export default DatabaseChangePage;
