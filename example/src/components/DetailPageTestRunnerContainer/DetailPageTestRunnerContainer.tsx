// DetailPageTestContainerRunner.tsx
import './DetailPageTestRunnerContainer.css';
import React from 'react';
import useState from 'react-usestateref';
import { TestRunner, ITestResult, TestCase } from 'cblite-tests';

import {
  IonButtons,
  IonButton,
  IonMenuButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonContent,
  IonItemDivider,
  IonToggle,
  IonLabel,
} from '@ionic/react';

interface ContainerProps<T extends new () => TestCase> {
  navigationTitle: string;
  collapseTitle: string;
  testCases: T[];
}

const DetailPageTestRunnerContainer: React.FC<ContainerProps<new () => TestCase>> 
  = ({ navigationTitle, collapseTitle, testCases }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [shouldCancel, setShouldCancel] = useState<boolean>(false);
  const [resultMessages, setResultMessages] = useState<ITestResult[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ITestResult | null>(null);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);

  function reset() {
    setSuccessCount(0);
    setFailedCount(0);
    setShowDetails(false);
    setShouldCancel(false);
    setResultMessages([]);
    setCurrentMessage(null);
  }

  function shouldTestCaseCancel (): boolean { 
    return shouldCancel;
  } 

  async function update() {
    setCurrentMessage(null);
    setResultMessages([]);
    setSuccessCount(0);
    setFailedCount(0);

    //todo fix cancellation token
    for (let counter = 0; counter < testCases.length; counter++) {
      setCurrentMessage(null);
      const testRunner = new TestRunner();
      const testGenerator = testRunner.runTests(
        testCases[counter],
        shouldTestCaseCancel,
      );
        for await (const result of testGenerator) {
          if (result.message === 'running') {
            setCurrentMessage(result);
          } else {
            if (result.success) {
              setSuccessCount(successCount => successCount + 1);
            } else {
              setFailedCount(failedCount => failedCount + 1);
            }
            setResultMessages(prev => [...prev, result]);
          }
        }
        setCurrentMessage(null); 
      }
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{collapseTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={reset}>
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
          <IonItemDivider key="divider1">
            <IonLabel key="divider1Label">Run Tests</IonLabel>
            <IonButtons slot="end">
              <IonToggle
                onIonChange={(e: any) => setShowDetails(e.detail.checked)}
                checked={showDetails}
              >
                Show Details
              </IonToggle>
              <IonButton
                key="btnCancel"
                onClick={() => setShouldCancel(true)}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px 2px 0px 25px',
                }}
              >
                <i className="fa-solid fa-stop"></i>
              </IonButton>
              <IonButton
                key="btnUpdate"
                onClick={update}
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
          <hr style={{ padding: '5px' }} />
          {currentMessage !== null ? (
            <IonItem key="itemCurrentRunning">
              <IonLabel key="lblCurrentRunning">
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                  <h2>{currentMessage.testName}</h2>
                  <i className="fa-duotone fa-spinner-third fa-spin"></i>
                </div>
                {showDetails && <p>{currentMessage.message}</p>}
              </IonLabel>
            </IonItem>
          ) : (
            <></>
          )}
          <IonItemDivider key="dividerStatusCounter">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <IonLabel key="lblSuccessCount">Success: {successCount}</IonLabel>
              <IonLabel key="lblFailedCount">Failed: {failedCount}</IonLabel>
            </div>
          </IonItemDivider>
          {
            Array.from(resultMessages.values()).map((result, index) => (
              <IonItem key={'item-' + index}>
                <IonLabel key={'lbl-' + index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <h2>{result.testName}</h2>
                    {result.message === 'running' ? (
                      <i className="fa-duotone fa-spinner-third fa-spin"></i>
                    ) : (
                      <i
                        className={`fa-duotone ${
                          result.success ? 'fa-check' : 'fa-x'
                        }`}
                      ></i>
                    )}
                  </div>
                  {showDetails && <p>{result.message}</p>}
                </IonLabel>
              </IonItem>
            ))
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default DetailPageTestRunnerContainer;
