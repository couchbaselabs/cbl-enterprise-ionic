// CreateCollection.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

const CreateCollectionPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update() {

  }

  function reset() {

  }

  return (
    <DetailPageContainer 
    navigationTitle="Create Collection" collapseTitle="Create Collection"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Create">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
      ></DatabaseNameForm>
       <p>Replace with Create Collection</p>
    </DetailPageContainer>
  );
};

export default CreateCollectionPage;