import React, { useContext } from 'react';
import { InjectedIntl, injectIntl } from 'react-intl';

// The singleton-ish holder for the intl value
export const IntlContext = React.createContext<InjectedIntl>(
  {} as InjectedIntl
);

// turn the old context into the new context
export const InjectIntlContext = injectIntl(({ intl, children }) => {
  return <IntlContext.Provider value={intl}>{children}</IntlContext.Provider>;
});

// The Hook itself, return `intl` object
export const useIntl = () => {
  return useContext(IntlContext);
};
