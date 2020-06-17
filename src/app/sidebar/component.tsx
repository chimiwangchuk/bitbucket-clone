import React from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import { getIsMobileHeaderActive } from 'src/selectors/global-selectors';
import { SidebarContext } from './context';

class Sidebar extends React.Component {
  unsubscribe: () => void;

  static contextType = SidebarContext;

  componentDidMount() {
    this.unsubscribe = this.context.onRenderSidebar(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const el = document.getElementById('bb-sidebar');
    if (!el) {
      return null;
    }

    return createPortal(this.props.children, el);
  }
}

export default connect((state: BucketState) => ({
  isMobile: getIsMobileHeaderActive(state),
}))(Sidebar);
