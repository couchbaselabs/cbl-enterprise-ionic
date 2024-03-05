// ListIndexes.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel } from '@ionic/react';

const ListIndexesPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function update () {

  }

  function reset () 
  {

  }

  return (
    <DetailPageContainer 
    navigationTitle="List Indexes" collapseTitle="List Indexes"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Get">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
    </DetailPageContainer>
  );
};

export default ListIndexesPage;