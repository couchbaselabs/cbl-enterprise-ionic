import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useRef, useState } from 'react';
import {
  BasicAuthenticator,
  ConcurrencyControl,
  Database,
  DatabaseChange,
  DatabaseConfiguration,
  DocumentReplication,
  MutableDocument,
  ReplicatedDocumentFlag,
  ReplicationDirection,
  Replicator,
  ReplicatorConfiguration,
  URLEndpoint,
} from '../../../dist/esm';
import './Home.css';

const DocumentReplicator: React.FC = () => {
  const outputRef = useRef<HTMLDivElement | null>(null);

  const testerRef = useRef<DocumentReplicatorTest>(
    new DocumentReplicatorTest(),
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id="output" ref={outputRef} />

        <IonInput
          placeholder="Enter DocId"
          clearInput
          onKeyUp={e => testerRef.current.setDocId((e.target as any).value)}
        />

        <IonList>
          {testerRef.current.documentChangeEvents.map((docChange: any) => (
            <IonItem>
              <IonLabel>Dir: {docChange.direction}</IonLabel>
              <p>Doc ID: {docChange.documents[0].id}</p>
            </IonItem>
          ))}
        </IonList>

        <IonFooter>
          <IonToolbar>
            <IonButton onClick={testerRef.current.save}>Save Doc</IonButton>
            <IonButton onClick={testerRef.current.getDocument}>
              Get Doc
            </IonButton>
            <IonButton onClick={testerRef.current.deleteDocument}>
              Delete Doc
            </IonButton>
            <IonButton onClick={testerRef.current.purgeDocument}>
              Purge Doc
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonContent>
    </IonPage>
  );
};

class DocumentReplicatorTest {
  database: Database;
  output: any;
  documentChangeEvents: DocumentReplication[] = [];

  docId: string;

  constructor() {
    this.docId = '';

    console.log('IONIC CBL ON READY');
    const config = new DatabaseConfiguration();
    config.setEncryptionKey('secret');
    const database = new Database('sandbox', config);
    /*
    database.setEngine(
      new CordovaEngine({
        allResultsChunkSize: 9999,
      }),
    );
    */
    this.database = database;
    this.preInit();
  }

  setDocId(id: string) {
    this.docId = id;
  }

  async preInit() {
    await this.database.open();
    console.log('Databases opened!');
    this.database.addChangeListener((change: DatabaseChange) => {
      console.log('DATABASE CHANGE', change, change.documentIDs);
    });
    await this.replicatorStart();
  }

  out(val: string) {
    this.output = val;
  }

  async save() {
    const doc = new MutableDocument(this.docId, undefined, {
      name: `Doc with ID ${this.docId}`,
      channels: 'sandbox',
    });
    await this.database.save(doc, ConcurrencyControl.FAIL_ON_CONFLICT);
    console.log('Saved Doc', doc);
    this.out(`saved document: ${JSON.stringify(doc.toDictionary())}`);
  }

  async getDocument() {
    const doc = await this.database.getDocument(this.docId);
    console.log('Got document', doc);
    if (doc) {
      this.out(`Got document: ${JSON.stringify(doc.toDictionary())}`);
    }
  }

  async deleteDocument() {
    const doc = await this.database.getDocument(this.docId);
    if (doc) {
      await this.database.deleteDocument(doc);
      console.log('Deleted document', doc);
      this.out(`Deleted document ${doc.getId()}`);
    } else {
      console.log(`No doc with id ${this.docId}`);
    }
  }

  async purgeDocument() {
    const doc = await this.database.getDocument(this.docId);
    await this.database.purgeDocument(doc);
    this.out(`Purged document ${this.docId}`);
  }

  async replicatorStart() {
    // Create replicators to push and pull changes to and from the cloud.
    if (!this.database) {
      return;
    }

    const database = this.database;
    // on android emulator localhost be bork use local network feedback loop
    const baseDomain = 'localhost';
    const targetEndpoint = new URLEndpoint(`ws://${baseDomain}:4984/sandbox`);
    const replConfig = new ReplicatorConfiguration(database, targetEndpoint);
    replConfig.setReplicatorType(
      ReplicatorConfiguration.ReplicatorType.PUSH_AND_PULL,
    );
    replConfig.setContinuous(true);
    replConfig.setChannels(['sandbox']);

    // Add authentication.
    replConfig.setAuthenticator(new BasicAuthenticator('sandbox', 'password'));

    // Create replicator.
    const replicator = new Replicator(replConfig);

    // Add Document Replicator
    replicator.addDocumentListener((documentChange: DocumentReplication) => {
      console.log('Document change!', documentChange);
      this.documentChangeEvents = [
        ...this.documentChangeEvents,
        documentChange,
      ];
      if (documentChange.getDirection() === ReplicationDirection.PULL) {
        documentChange.getDocuments().forEach(async doc => {
          if (doc.getFlags().includes(ReplicatedDocumentFlag.DELETED)) {
            await this.database.purgeDocument(doc.getId());
            this.out(
              `Purged docId ${doc.getId()} based on ${documentChange.getDirection()} replication event`,
            );
          }
        });
      }
    });

    // Start replication.
    await replicator.start();

    this.out('Replicator started');
  }
}

export default DocumentReplicator;
