import { PureComponent } from 'react';

type Props = {
  dismissSiteMessageFlag: () => void;
  siteMessageFlag: boolean;
  showSiteMessageFlag: () => void;
};

export class SiteMessageFlagManager extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.siteMessageFlag) {
      this.props.showSiteMessageFlag();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { siteMessageFlag } = this.props;

    if (siteMessageFlag && prevProps.siteMessageFlag !== siteMessageFlag) {
      this.props.showSiteMessageFlag();
    }

    if (!siteMessageFlag && prevProps.siteMessageFlag !== siteMessageFlag) {
      this.props.dismissSiteMessageFlag();
    }
  }

  render() {
    return null;
  }
}
