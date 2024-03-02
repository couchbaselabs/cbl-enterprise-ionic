// DatabaseOpen.tsx
import React from 'react';
import DetailPageContainer from '../../components/DetailPageContainer/DetailPageContainer';

const CustomLogPage: React.FC = () => {
  return (
    <DetailPageContainer 
    navigationTitle="Custom Log" collapseTitle="Custom Log">
       <p>Custom Log</p>
    </DetailPageContainer>
  );
};

export default CustomLogPage;