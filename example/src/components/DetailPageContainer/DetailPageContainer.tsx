// DetailPageContainer.tsx
import './DetailPageContainer.css';
import React from 'react';
import { IonButtons,IonMenuButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

interface ContainerProps {
	navigationTitle: string;
	collapseTitle: string;
	children: React.ReactNode;
}

const DetailPageContainer: React.FC<ContainerProps> = ({navigationTitle, collapseTitle, children}) => {
	return (
		<IonPage>
		<IonHeader>
		  <IonToolbar>
		  <IonButtons slot="start">
			  <IonMenuButton />
			</IonButtons>
			<IonTitle>{collapseTitle}</IonTitle>
		  </IonToolbar>
		</IonHeader>
		<IonContent fullscreen>
		<IonHeader collapse="condense">
			<IonToolbar>
			  <IonTitle size="large">{navigationTitle}</IonTitle>
			</IonToolbar>
		  </IonHeader>
		  <div id="pageContainer">
     		{children} 
    	</div>
		</IonContent>
	  </IonPage>
	)
};
export default DetailPageContainer;