// TestRunners.tsx
import React, { useState, useContext } from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageTestContainerRunner from '../../components/DetailPageTestRunnerContainer/DetailPageTestRunnerContainer';

import {
  IonItemDivider,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

const QueryTestPage: React.FC = () => {
	const [showDetails, setShowDetails] = useState<boolean>(false);

	function reset() {
	}

	function update() {

	}

  return (
  	<DetailPageTestContainerRunner
 	 navigationTitle="Query SQL++ Tests"
  	collapseTitle="Query SQL++ Tests"
  	sectionTitle="Run Tests"
	showDetails={showDetails}
	setShowDetails={setShowDetails}
  	onReset={reset}
  	onUpdate={update}>
		<>
		</>
  	</DetailPageTestContainerRunner>
	);
};
export default QueryTestPage;
