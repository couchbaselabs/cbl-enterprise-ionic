// ListCollections.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { IonItemDivider, IonLabel } from '@ionic/react';

const ListCollectionPage: React.FC = () => {

  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

    function update() {

    }

    function reset () {

    }

    return (
      <DetailPageContainer 
      navigationTitle="List Collections" collapseTitle="ListCollections"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Get">
        <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}  />
      <IonItemDivider>
        <IonLabel>Collection</IonLabel>
      </IonItemDivider>
      </DetailPageContainer>
    );
  };
export default ListCollectionPage;