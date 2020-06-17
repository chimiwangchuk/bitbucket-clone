import React from 'react';

import Fact from '../fact';

type Context = {
  publishFact: (fact: Fact<any>) => void;
};

const context: Context = {
  // Frontbucket should set the value here be a function that will publish a Fact.
  // Consumers that don't use the Provider should have a no-op as the method.
  publishFact: () => {},
};

export default React.createContext(context);
