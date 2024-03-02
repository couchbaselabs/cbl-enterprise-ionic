// DatabaseClose.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

const DatabaseClosePage: React.FC = () => {
  const { databases, setDatabases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function reset() {
    setDatabaseName('');
    setResultsMessage('');
  }

  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        db.close()
          .then(() => {
            setResultsMessage('success');
          })
          .catch((error: unknown) => {
            setResultsMessage('' + error);
          });
      }
    } else {
      setResultsMessage('Error: Database not found');
    }
  }

  return (
    <DetailPageContainer 
    navigationTitle="Database Close" collapseTitle="Database Close">
     <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
        buttonName="Close"
        update={update}
        reset={reset}
        resultsMessage={resultsMessage} 
      ></DatabaseNameForm>
    </DetailPageContainer>
  );
};

export default DatabaseClosePage;