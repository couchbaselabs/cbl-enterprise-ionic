// DeleteDocument.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import DocumentIdForm from '../../components/DocumentIdForm/DocumentIdForm';

const DeleteDocumentPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string>('');

  function reset() {
    setDatabaseName('');
    setDocumentId('');
    setResultsMessage('');
  }

  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        db.getDocument(documentId)
          .then((doc: any) => {
            if (doc.id !== null) {
              db.deleteDocument(doc)
                .then(() => {
                  setResultsMessage('success');
                })
                .catch((error: string) => {
                  setResultsMessage(error);
                });
            } else {
              setResultsMessage('Error: Document not found');
            }
          })
          .catch((error: string) => {
            setResultsMessage(error);
          });
      }
    } else {
      setResultsMessage('Error: Database is not setup (defined)');
    }
  }

  return (
    <DetailPageContainer
      navigationTitle="Delete Document"
      collapseTitle="Delete Document"
      onReset={reset}
      onAction={update}
      resultsMessage={resultsMessage}
      actionLabel="Delete">
      <DocumentIdForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
        setDocumentId={setDocumentId}
        documentId={documentId}
      />
    </DetailPageContainer>
  );
};

export default DeleteDocumentPage;
