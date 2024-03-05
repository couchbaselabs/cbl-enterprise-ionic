// QueryBuilder.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel } from '@ionic/react';

const QueryBuilderPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update() {

  }

  function reset() {

  }

  return (
    <DetailPageContainer 
    navigationTitle="Query Builder" collapseTitle="Query Builder"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Run">
     <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
      <IonItemDivider>
        <IonLabel>Query Builder</IonLabel>
      </IonItemDivider>
    </DetailPageContainer>
  );
};

export default QueryBuilderPage;