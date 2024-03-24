import React from 'react';
import {
  IonButtons,
  IonButton,
  IonMenuButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonLabel,
  IonItemGroup,
  IonItemDivider,
  IonContent,
} from '@ionic/react';

import DatabaseNameForm from '../../components/DatabaseNameForm/DatabaseNameForm';

interface ContainerProps {
  navigationTitle: string;
  collapseTitle: string;
  onReset: () => void;
  onAction: () => void;
  databaseName: string;
  setDatabaseName: (name: string) => void;
  sectionTitle: string;
  titleButtons: React.ReactNode | undefined;
  children: React.ReactNode;
  resultsChildren: React.ReactNode;
}

const DetailPageContainerRun: React.FC<ContainerProps> = ({
  navigationTitle,
  collapseTitle,
  onReset,
  onAction,
  databaseName,
  setDatabaseName,
  sectionTitle,
  titleButtons,
  children,
  resultsChildren,
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{collapseTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onReset}>
              <i className="fa-duotone fa-arrows-rotate"></i>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{navigationTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <DatabaseNameForm
            setDatabaseName={setDatabaseName}
            databaseName={databaseName}
          />
          <IonItemDivider>
            <IonLabel>{sectionTitle}</IonLabel>
            <IonButtons slot="end">
			  {titleButtons ? titleButtons : null}
              <IonButton
                key="btnUpdate"
                onClick={onAction}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px 2px 0px 25px',
                }}
              >
                <i className="fa-duotone fa-play"></i>
              </IonButton>
            </IonButtons>
          </IonItemDivider>
          {children}
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Results</IonLabel>
            </IonItemDivider>
            {resultsChildren}
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
export default DetailPageContainerRun;
