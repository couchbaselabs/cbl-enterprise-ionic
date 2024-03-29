// DetailPageContainer.tsx
import './DetailPageContainer.css';
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
	IonLabel,
	IonItem,
	IonItemGroup,
	IonItemDivider,
	IonContent } 
from '@ionic/react';

import { refreshCircle } from 'ionicons/icons';

interface ContainerProps {
	navigationTitle: string;
	collapseTitle: string;
	onReset: () => void;
	onAction: () => void;
	actionLabel: string;
	resultsMessage: string;
	children: React.ReactNode;
	
}

const DetailPageContainer: React.FC<ContainerProps> = ({  navigationTitle, 
	collapseTitle, 
	onReset, 
	onAction,
	actionLabel,
	resultsMessage, 
	children,}) => {
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
			 <IonItemGroup>
          		<IonItemDivider>
            		<IonLabel>Results</IonLabel>
          		</IonItemDivider>
          		<IonItem>
            		<IonLabel>
						{resultsMessage}
					</IonLabel>
          		</IonItem>
        	</IonItemGroup>
			</>
			) : null }
		  </IonList>
		</IonContent>
	  </IonPage>
	)
};
export default DetailPageContainer;