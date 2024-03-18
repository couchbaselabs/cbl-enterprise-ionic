// DatabaseDelete.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

const DatabaseDeletePage: React.FC = () => {
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
        db.deleteDatabase()
          .then(() => {
            setDatabases(prevState => {
              //after closing the database remove it from the provider
              const newState = { ...prevState };
              delete newState[databaseName];
              return newState;
            });
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
    navigationTitle="Database Delete" collapseTitle="Database Delete"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Delete">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
      ></DatabaseNameForm>
    </DetailPageContainer>
  );
};

export default DatabaseDeletePage;