// SqlPlusPlus.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel } from '@ionic/react';

const SqlPlusPlusPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update() {

  }

  function reset() {

  }

  return (
    <DetailPageContainer 
    navigationTitle="Query SQL++" collapseTitle="Query SQL++"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Run">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
      <IonItemDivider>
        <IonLabel>Editor</IonLabel>
      </IonItemDivider>
    </DetailPageContainer>
  );
};

export default SqlPlusPlusPage;