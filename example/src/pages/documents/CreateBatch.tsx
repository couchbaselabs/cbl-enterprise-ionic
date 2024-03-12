// CreateBatch.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerItemResults from '../../components/DetailPageContainerItemResults/DetailPageContainerItemResults';
import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';
import {
  DataGeneratorService,
  ProductType,
} from '../../services/DataGeneratorService';

import {
  IonItemDivider,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
} from '@ionic/react';

import { trashOutline } from 'ionicons/icons';

import {
  Database,
  MutableDocument,
  QueryBuilder,
  SelectResult,
  DataSource,
  Expression,
} from 'couchbase-lite-ee-ionic';

const CreateBatchPage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);
  const [resultsCount, setResultsCount] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  async function update() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        setIsError(false);

        let generator = new DataGeneratorService();
        let products = generator.productDocs;

        await db.inBatch(() => {
          for (let key in products) {
            let docKey = Number(key);
            let product = products[docKey];

            let document = getDocumentFromProduct(product);
            if (document != null) {
              try {
              db.save(document);
              } catch (e){
                setResultsMessage(prev => [...prev, 'Error: saving document ' + e]);

              }
            } else {
              setResultsMessage(['Error: Document is null from helper method for productId ' + product.id]);
            }
          }
        });

        await validateDocuments(db);
      } else {
        setResultsMessage(['Error: Database is null)']);
      }
    } else {
      setResultsMessage(['Error: Database is not setup (defined)']);
    }
  }

  function getDocumentFromProduct(product: ProductType) {
    let document = new MutableDocument(product.id);
    document.setString('category', product.doc.category);
    document.setString('name', product.doc.name);
    document.setString('id', product.id);
    document.setString('location', product.doc.location);
    document.setString('documentType', product.doc.documentType);
    document.setDate('createdOn', product.doc.createdOn);
    document.setNumber('price', product.doc.price);
    document.setInt('quantity', product.doc.quantity);
    document.setBoolean('isOnSale', product.doc.isOnSale);
    return document;
  }

  //validate documents saved only if there wasn't errors
  async function validateDocuments(db: Database) {
    if (!isError) {
      let query = QueryBuilder.select(SelectResult.all())
        .from(DataSource.database(db))
        .where(
          Expression.property('documentType').equalTo(
            Expression.string('product'),
          ),
        );

      try {
        const resultSet = await (await query.execute()).allResults();
        setResultsCount(resultSet.length.toString());
        for (let result of resultSet) {
          let doc = result.getDictionary('_doc');
          let id = doc.getString('id');
          let name = doc.getString('name');
          setResultsMessage(prev => [
            ...prev,
            'Document Saved: ' + id + ' : ' + name,
          ]);
        }
      } catch (e) {
        setResultsMessage(prev => [...prev, 'Error Data Validation: ' + e]);
      }
    }
  }

  async function deleteProductDocuments() {
    if (databaseName in databases) {
      let db = databases[databaseName];
      if (db != null) {
        let query = QueryBuilder.select(SelectResult.all())
          .from(DataSource.database(db))
          .where(
            Expression.property('documentType').equalTo(
              Expression.string('product'),
            ),
          );

        try {
          const resultSet = await (await query.execute()).allResults();
          setResultsCount(resultSet.length.toString());
          for (let result of resultSet) {
            let doc = result.getDictionary('_doc');
            let id = doc.getString('id');
            db.deleteDocument(id).then(() => {
              setResultsMessage(prev => [...prev, 'success deleted document: ' + id]);
            })
            .catch((error: string) => {
              setResultsMessage(prev => [...prev, 'Error deleting document ' + error]);
            });
          }
        } catch (e) {
          setIsError(true);
          setResultsMessage(prev => [...prev, 'Error Data Validation: ' + e]);
        }
      } else {
        setResultsMessage(['Error: Database is null)']);
      }
    } else {
      setResultsMessage(['Error: Database is not setup (defined)']);
    }
  }

  function reset() {
    setDatabaseName('');
    setResultsCount('');
    setResultsMessage([]);
  }

  return (
    <DetailPageContainerItemResults
      navigationTitle="Create Batch"
      collapseTitle="Create Batch"
      onReset={reset}
      onAction={update}
      actionLabel="Run Batch Create"
      resultsCount={resultsCount}
      children={
        <>
          <DatabaseNameForm
            setDatabaseName={setDatabaseName}
            databaseName={databaseName}
          />
          <IonItemDivider>
            <IonLabel>Document Batch</IonLabel>
            <IonButtons slot="end">
              <IonButton
                onClick={deleteProductDocuments}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px 5px',
                }}
              >
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonButtons>
          </IonItemDivider>
        </>
      }
      resultsChildren={
        <>
          {resultsMessage.map((message, index) => (
            <IonItem key={index} className="wrap-text">
              <IonLabel className="wrap-text">{message}</IonLabel>
            </IonItem>
          ))}
        </>
      }
    ></DetailPageContainerItemResults>
  );
};

export default CreateBatchPage;
