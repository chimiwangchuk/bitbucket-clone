import React, { createContext } from 'react';
import WidthDetector from '@atlaskit/width-detector';

export const ContentWidthContext = createContext<number | undefined>(undefined);

export const ContentWidthProvider: React.FC = ({ children }) => {
  return (
    <WidthDetector>
      {width => (
        <ContentWidthContext.Provider value={width}>
          {children}
        </ContentWidthContext.Provider>
      )}
    </WidthDetector>
  );
};
