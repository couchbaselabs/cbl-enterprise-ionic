// AuthenticationBasicForm.tsx
import React from 'react';
import { 
	IonContent,
	IonButton,
	IonItem,
	IonInput,
	IonLabel,
	} 
from '@ionic/react';


interface ContainerProps {
	fieldOneLabel: string;
	fieldTwoLabel: string;
	onSetFieldOne: (value: string) => void;
	OnSetFieldTwo: (value: string) => void;
	onAction: () => void;
}

const AuthenticationBasicForm: React.FC<ContainerProps> = ({  
	fieldOneLabel,
	fieldTwoLabel,
	onSetFieldOne,
	OnSetFieldTwo,
	onAction
	}) => {
	return (
		<IonContent>
			<IonItem>
				<IonLabel position="floating">{fieldOneLabel}</IonLabel>
				<IonInput onIonChange={(e: any) => onSetFieldOne(e.target.value)}></IonInput>
			</IonItem>
			<IonItem>
				<IonLabel position="floating">{fieldTwoLabel}</IonLabel>
				<IonInput onIonChange={(e: any) => OnSetFieldTwo(e.target.value)}></IonInput>
			</IonItem>
			<IonButton onClick={onAction}><i className="fa-solid fa-floppy-disk-circle-arrow-right"></i> Save</IonButton>
		</IonContent>	
	)
};
export default AuthenticationBasicForm;