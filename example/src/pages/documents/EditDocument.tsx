// CreateDocument.tsx
import React, { useState, useContext, useEffect } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';
import { DataGeneratorService, WidgetType } from '../../services/DataGeneratorService';

import {
	IonItemDivider,
	IonItem,
	IonInput,
	IonLabel,
  IonSelect,
  IonSelectOption
  } from '@ionic/react';
import { MutableDocument, Blob } from 'cblite';

const EditDocumentPage: React.FC = () => {
  //database stuff
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  //document stuff
  const [documentId, setDocumentId] = useState<string>('');
  const [document, setDocument] = useState<string>('');
  //results stuff 
  const [resultsMessage, setResultsMessage] = useState<string>('');
  //select list - generated data
  const [selectKey, setSelectKey] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<string>();
  const [dictionary, setDictionary] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState<{[key: number]: WidgetType}>();
  
  useEffect(() => {
    let ds = new DataGeneratorService(); 
    let data = ds.dictionaryDocs;
    let newDictionary: { [key: string]: string } = {};
    for (let key in data) {
      //check if the data has a blob or not, if so le them know so they can select
      newDictionary[key] = (data[key].blob != null) ? data[key].id + ' - blob : ' + data[key].doc.name : data[key].id + ' : ' + data[key].doc.name;
    }
    //set both the raw data and the dictionary to pick a document from
    setData(data);
    setDictionary(newDictionary);//update the state
  },[]);

  
  function reset() {
    setDatabaseName('');
    setDocumentId('');
    setDocument('');
    setSelectKey(selectKey => selectKey + 1);
    setSelectedDocument(undefined);
    setResultsMessage('');
  }

  function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        //create a mutable document to save into the database
        let doc = new MutableDocument(documentId);
        doc.setData(JSON.parse(document));
        //check if there is a blob to set
        if (selectedDocument !== undefined && data !== undefined) {
          let key = parseInt(selectedDocument);
          let selectedData = data[key];
          if (selectedData.blob != null) {
            let abBlob = DataGeneratorService.getBlobFromBase64(selectedData.blob);  
            if (abBlob != null){
              let blob = new Blob("image/jpeg",abBlob);
              doc.setBlob('image', blob);
            }
          }
        }
        db.save(doc)
          .then(() => {
            if (documentId in db._documents) {
              setResultsMessage('Document Created');
            } else {
              let message = 'Error: Id not found in _documents ' + documentId;
              setResultsMessage(message);
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
    navigationTitle="Document Editor" collapseTitle="Document Editor"
    onReset={reset}
    onAction={update}
    resultsMessage={resultsMessage}
    actionLabel="Save">
        <DatabaseNameForm
        setDatabaseName={setDatabaseName}
        databaseName={databaseName}
        />
        <IonItemDivider>
          <IonLabel>Document Information</IonLabel>
        </IonItemDivider>
        <IonItem key={1}>
          <IonInput
            onInput={(e: any) => setDocumentId(e.target.value)}
            placeholder="Document ID"
            value={documentId}
          ></IonInput>
        </IonItem>
        <IonItem key={2} lines="full">
          <IonLabel position="stacked">Document</IonLabel>
          <textarea 
            style={{ width: '100%', padding: '16px 0px' }} 
            rows={4}
            value={document}
            onChange={(e: any) => setDocument(e.detail.value)} 
            placeholder="{ 'message': 'hello world' }">
          </textarea>
        </IonItem>
        <IonItemDivider>
          <IonLabel>Generated Data</IonLabel>
        </IonItemDivider>
        <IonItem key={3}>
          <IonSelect
            key={selectKey}
            placeholder='Generated Documents'
            value={selectedDocument}
            onIonChange={ e => 
              {
                const key = e.detail.value;
                if (data !== null && data !== undefined){
                  setSelectedDocument(key);
                  setDocumentId(data[key].id)
                  setDocument(JSON.stringify(data[key].doc));
                }
              }
            }
          >
            {Object.entries(dictionary).map(([key, value]) => (
              <IonSelectOption value={key}>{value}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
    </DetailPageContainer>
  );
};

export default EditDocumentPage;