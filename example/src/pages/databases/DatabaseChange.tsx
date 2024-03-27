// DatabaseChange.tsx
import React, { useState, useContext, useEffect } from 'react';

import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerStringResults from '../../components/DetailPageContainerStringResults/DetailPageContainerStringResults';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

import { MutableDocument } from 'cblite';
import { ChangeListeners } from 'cblite-ionic';

import { IonItemDivider, IonLabel } from '@ionic/react';

const DatabaseChangePage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessages, setResultsMessages] = useState<string[]>([]);
  const [changeListeners, setChangeListeners] =
    useState<ChangeListeners | null>(null);
  const [isListenerAdded, setIsListenerAdded] = useState(false);

  useEffect(() => {
    if (changeListeners) {
      setResultsMessages(prev => [
        ...prev,
        'adding change listener',
      ]);
      const addListener = async () => {
        let token = await changeListeners.addChangeListener(change => {
          setResultsMessages(prev => [
            ...prev,
            `Database Change: ${change.documentIDs.join(', ')}`,
          ]);
        });
        setIsListenerAdded(true);
        setResultsMessages(prev => [
          ...prev,
          'set listener token',
        ]);
      };
      addListener();
    }
  }, [changeListeners]);

  useEffect(() => {
    if (isListenerAdded) {
      try {
        const database = databases[databaseName];
        setResultsMessages(prev => [
          ...prev,
          `Listening for changes on database: ${databaseName}`,
        ]);

        const saveDocuments = async () => {
          let doc1 = new MutableDocument();
          let doc2 = new MutableDocument();
          doc1.setId('doc1');
          doc1.setString('name', 'Alice');
          doc2.setId('doc2');
          doc2.setString('name', 'tdbgamer');
          await database.save(doc1);
          await database.save(doc2);
        };
        saveDocuments();
      } catch (error) {
        setResultsMessages(error.message);
      }
    }
  }, [isListenerAdded]);

  async function update() {
    try {
      const database = databases[databaseName];
      if (database != null) {
        let cl = new ChangeListeners(database);
        setChangeListeners(cl);
        /*
        let token = await changeListeners.addChangeListener(change => {
          setResultsMessages(prev => [...prev, 
            `Database Change: ${change.documentIDs.join(', ')}`]
          );
        });
        setListenerToken(token);
        */
      }
    } catch (error) {
      setResultsMessages(error.message);
    }
  }

  function reset() {
    const database = databases[databaseName];
    if (database != null && isListenerAdded) {
      setChangeListeners(null);
      setIsListenerAdded(false);
      setResultsMessages([
        `Removed Listening for changes on database: ${databaseName}`,
      ]);
    }
    setDatabaseName('');
  }

  return (
    <DetailPageContainerStringResults
      navigationTitle="Database Change"
      collapseTitle="Database Change"
      onReset={reset}
      onAction={update}
      actionLabel="Listen"
      results={resultsMessages}
    >
      <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
      />
      <IonItemDivider>
        <IonLabel>Database Change</IonLabel>
      </IonItemDivider>
    </DetailPageContainerStringResults>
  );
};

export default DatabaseChangePage;
