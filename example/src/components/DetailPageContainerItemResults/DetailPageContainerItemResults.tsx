// DetailPageContainerItemResult.tsx
import './DetailPageContainerItemResults.css';

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
	IonItemGroup, 
	IonItemDivider,
	IonLabel } 
from '@ionic/react';

import { refreshCircle } from 'ionicons/icons';

interface ContainerProps {
	navigationTitle: string;
	collapseTitle: string;
	onReset: () => void;
	onAction: () => void;
	actionLabel: string;
	resultsCount: string;
	children: React.ReactNode;
	resultsChildren: React.ReactNode;
}

const DetailPageContainerItemResults: React.FC<ContainerProps> = ({  navigationTitle, 
	collapseTitle, 
	onReset, 
	onAction,
	actionLabel,
	resultsCount,
	children, 
	resultsChildren}) => {

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

     		{children} 

			{ actionLabel !== "" ? ( 
			<>
			 <IonButton
          		onClick={onAction}
          		style={{
            		display: 'block',
            		marginLeft: 'auto',
            		marginRight: 'auto',
            		padding: '20px 80px',
          		}}
        		>
				{actionLabel}
        	</IonButton>
			</>
			) : null }
			<IonItemGroup>
        		<IonItemDivider>
          			<IonLabel>Results {resultsCount}</IonLabel>
        		</IonItemDivider>
				{resultsChildren}
			</IonItemGroup>
		  </IonList>
		</IonContent>
	  </IonPage>
	)
};
export default DetailPageContainerItemResults;