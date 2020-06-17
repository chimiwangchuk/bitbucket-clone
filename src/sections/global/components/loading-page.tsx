import AkPage from '@atlaskit/page';
import Spinner from '@atlaskit/spinner';
import React, { PureComponent } from 'react';

import { Content } from 'src/app/page.styled';

import * as styles from './loading.style';

export default class LoadingPage extends PureComponent<any> {
  render() {
    return (
      <AkPage>
        <Content isBannerOpen={false}>
          <styles.Loading>
            <Spinner delay={0} size="large" />
          </styles.Loading>
        </Content>
      </AkPage>
    );
  }
}
