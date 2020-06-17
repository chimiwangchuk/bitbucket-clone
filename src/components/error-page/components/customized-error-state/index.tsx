import React, { ReactNode } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import errorIllustration from 'src/sections/repository/sections/source/components/error-illustration.svg';
import messages from './i18n';
import {
  CustomizedErrorStateLogo,
  CustomizedErrorStateTitle,
  CustomizedErrorStateWrapper,
} from './customized-error-state.styles';

export type CustomizedErrorStateProps = {
  title: ReactNode;
  children: ReactNode;
  intl: InjectedIntl;
};

export class CustomizedErrorState extends React.PureComponent<
  CustomizedErrorStateProps
> {
  render() {
    const { title, children, intl } = this.props;

    return (
      <CustomizedErrorStateWrapper>
        <CustomizedErrorStateLogo
          src={errorIllustration}
          alt={intl.formatMessage(messages.alt)}
        />
        <CustomizedErrorStateTitle>{title}</CustomizedErrorStateTitle>
        {children}
      </CustomizedErrorStateWrapper>
    );
  }
}

export default injectIntl(CustomizedErrorState);
