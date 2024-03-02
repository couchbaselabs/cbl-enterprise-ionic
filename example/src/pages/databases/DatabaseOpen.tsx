// DatabaseOpen.tsx
import React, { useState, useContext } from 'react';

import DatabaseContext from '../../providers/DatabaseContext';

import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';

//import the database in order to create/open a database

const DatabaseOpenPage: React.FC = () => {
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
        db.open()
          .then(() => {
            setResultsMessage('success');
          })
          .catch((error: unknown) => {
            setResultsMessage('' + error);
          });
      }
    } else {
      setResultsMessage('Error: Database is not setup (defined)');
    }
  }

  return (
    <DetailPageContainer navigationTitle="Database Open" collapseTitle="Open">
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
        buttonName="Open"
        update={update}
        reset={reset}
        resultsMessage={resultsMessage}
      ></DatabaseNameForm>
    </DetailPageContainer>
  );
};

export default DatabaseOpenPage;
