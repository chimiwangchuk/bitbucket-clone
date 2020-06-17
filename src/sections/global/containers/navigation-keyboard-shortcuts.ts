import { connect } from 'react-redux';

import toggleKeyboardShortcutMenu from 'src/redux/global/actions/toggle-keyboard-shortcut-menu';
import updateNavigationState from 'src/redux/global/actions/update-navigation-state';
import toggleSearchDrawer from 'src/redux/global/actions/toggle-search-drawer';
import NavigationKeyboardShortcuts from '../components/navigation-keyboard-shortcuts';

const mapDispatchToProps = {
  toggleKeyboardShortcutMenu,
  toggleNavigation: updateNavigationState,
  toggleSearchDrawer,
};

export default connect(
  undefined,
  mapDispatchToProps
)(NavigationKeyboardShortcuts);
