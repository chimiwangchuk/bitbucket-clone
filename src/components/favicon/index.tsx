import React, { PureComponent } from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import Favicon from 'react-favicon';
import { connect } from 'react-redux';

import { getFaviconUrl } from 'src/redux/favicon';
import { BucketState } from 'src/types/state';

const mapStateToProps = (state: BucketState) => ({
  url: getFaviconUrl(state),
});

type Props = {
  url: string;
};

export default connect(mapStateToProps)(
  class extends PureComponent<Props> {
    render() {
      const { url } = this.props;
      return <Favicon url={url} />;
    }
  }
);
