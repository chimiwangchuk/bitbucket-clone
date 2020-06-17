import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'src/router/utils';

type HistoryWatcherProps = RouteComponentProps | any;

class HistoryWatcher extends React.Component<HistoryWatcherProps> {
  unlisten: () => void | null | undefined;

  componentDidMount() {
    const { performance } = window;
    const { history } = this.props;

    if (typeof performance.mark !== 'function') {
      return;
    }

    // @ts-ignore TODO: fix noImplicitAny error here
    this.unlisten = history.listen((_location, action) => {
      // Set marker for use in timing.  Possible action types
      // are PUSH, POP and REPLACE. Ignore REPLACE actions because
      // they are redirects
      if (action !== 'REPLACE') {
        performance.clearMarks('ROUTECHANGE');
        performance.mark('ROUTECHANGE');
      }
    });
  }

  componentWillUnmount() {
    if (typeof this.unlisten === 'function') {
      this.unlisten();
    }
  }

  render() {
    return null;
  }
}

export default withRouter(HistoryWatcher);
