import { connect } from 'react-redux';
import { PureComponent } from 'react';
import { showFlagComponent } from 'src/redux/flags';
import { BucketState, BucketDispatch } from 'src/types/state';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { shouldDisplayFlag } from 'src/sections/global/components/flags/ie-deprecation/ie-deprecation-store';

type Props = {
  currentUserId: string;
  isBrowserMsie11: boolean;
  showIeDeprecationMessageTwo: () => void;
};

// bitbucket no longer supports IE11.   If the user is using IE11 and hasn't dismissed the warning message
//   'ie-deprecation-flag-two' then show the flag.  Originally there were 2 warnings - now we only show the final one.
export class IeDeprecationManager extends PureComponent<Props> {
  componentDidMount() {
    this.displayFlag();
  }

  componentDidUpdate(_: Props) {
    this.displayFlag();
  }

  displayFlag() {
    const { currentUserId, isBrowserMsie11 } = this.props;

    if (
      isBrowserMsie11 &&
      shouldDisplayFlag(currentUserId, 'ie-deprecation-flag-two')
    ) {
      this.props.showIeDeprecationMessageTwo();
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state: BucketState) => {
  const currentUser = getCurrentUser(state);

  return {
    currentUserId: currentUser && currentUser.uuid,
    isBrowserMsie11: state.global.isBrowserMsie11,
  };
};

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  showIeDeprecationMessageTwo: () => {
    dispatch(showFlagComponent('ie-deprecation-flag-two'));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IeDeprecationManager);
