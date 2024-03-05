// CreateBatch.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';
import { IonItemDivider, IonLabel } from '@ionic/react';

const CreateBatchPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update() {

  }

  function reset () {

  }

  return (
    <DetailPageContainer 
    navigationTitle="Create Batch" collapseTitle="Create Batch"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Create Documents"> 
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
      <IonItemDivider>
        <IonLabel>Document Batch</IonLabel>
      </IonItemDivider>
    </DetailPageContainer>
  );
};

export default CreateBatchPage;