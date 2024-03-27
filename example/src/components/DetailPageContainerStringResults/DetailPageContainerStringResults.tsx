// DetailPageContainerStrinResults.tsx
import React from 'react';
import { 
	IonItem,
	IonLabel 
} from '@ionic/react';

import  DetailPageContainerBase from '../DetailPageContainerBase/DetailPageContainerBase';

interface ContainerProps {
	navigationTitle: string;
	collapseTitle: string;
	onReset: () => void;
	onAction: () => void;
	actionLabel: string;
	results: string[];
	children: React.ReactNode;
}

const DetailPageContainerStringResults: React.FC<ContainerProps> = ({  
	navigationTitle, 
	collapseTitle, 
	onReset, 
	onAction,
	actionLabel,	
	results,
	children}) => {
	return (
	<DetailPageContainerBase
      navigationTitle={navigationTitle}
      collapseTitle= {collapseTitle}
      onReset={onReset}
	  onAction={onAction}
	  actionLabel={actionLabel}
	  children={children}
	  resultsChildren={results.map((result, index) => (
		<IonItem key="item-results-key">
			<IonLabel key="item-results-label">{result}</IonLabel>
		</IonItem>
	  ))}>
	  </DetailPageContainerBase>
	)
};
export default DetailPageContainerStringResults;