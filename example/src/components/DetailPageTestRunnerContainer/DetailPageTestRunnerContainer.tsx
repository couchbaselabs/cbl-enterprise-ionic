// DetailPageTestContainerRunner.tsx
import './DetailPageTestRunnerContainer.css';

import React from 'react';

import { 
	IonButtons,
	IonButton,
	IonMenuButton, 
	IonIcon,
	IonPage, 
	IonHeader, 
	IonToolbar, 
	IonTitle, 
	IonList,
	IonContent,
	IonItemDivider,
	IonToggle,
	IonLabel } 
from '@ionic/react';

import { refreshCircle, playOutline } from 'ionicons/icons';

interface ContainerProps {
	navigationTitle: string;
	collapseTitle: string;
	sectionTitle: string;
	showDetails: boolean;
	setShowDetails: (value: React.SetStateAction<boolean>) => void;
	onReset: () => void;
	onUpdate: () => void;
	children: React.ReactNode;
}

const DetailPageTestRunnerContainer: React.FC<ContainerProps> = ({  	 
	navigationTitle, 
	collapseTitle, 
	sectionTitle,
	showDetails,
	setShowDetails,
	onReset, 
	onUpdate,
	children}) => {

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
  					<IonIcon icon={refreshCircle} />
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
		  <IonItemDivider>
            <IonLabel>{sectionTitle}</IonLabel>
            <IonButtons slot="end">
			<IonToggle
          		onIonChange={(e: any) => setShowDetails(e.target.value)}
          		checked={showDetails}
        		>Show Details</IonToggle>
              <IonButton
                onClick={onUpdate}
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

		  </IonList>
		</IonContent>
	  </IonPage>
	)
};

export default DetailPageTestRunnerContainer;