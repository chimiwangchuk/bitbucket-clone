import React from 'react';
import Spinner from '@atlaskit/spinner';

import * as styles from './transparent-loading-cover.styled';

const TransparentLoadingCover = () => {
  return (
    <styles.Loader data-qa="transparent-loading-cover">
      <Spinner />
    </styles.Loader>
  );
};

export default TransparentLoadingCover;
