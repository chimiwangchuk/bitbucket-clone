import React from 'react';
import { FormattedMessage } from 'react-intl';
// @ts-ignore TODO: fix noImplicitAny error here
import { PopupSelect } from '@atlaskit/select';
import DownIcon from '@atlaskit/icon/glyph/chevron-down';
import Spinner from '@atlaskit/spinner';

import { useIntl } from 'src/hooks/intl';
import { Site } from 'src/redux/jira/types';
import { LoadingStatus } from 'src/constants/loading-status';
import { publishUiEvent } from 'src/utils/analytics/publish';
import messages from './site-chooser.i18n';
import { SiteLabel } from './site-chooser.styled';
import {
  DownIconWrapper,
  TargetButton,
  TargetButtonText,
} from './popup-select-target.styled';

type Props = {
  fetchedStatus: LoadingStatus;
  isDisabled: boolean;
  onSelectedChange: (selected: Site) => void;
  selected?: Site;
  sites: Site[];
};

const isLoading = (fetchedStatus: LoadingStatus) =>
  !(
    fetchedStatus === LoadingStatus.Success ||
    fetchedStatus === LoadingStatus.Failed
  );

const targetLabel = (
  fetchedStatus: LoadingStatus,
  sites: Site[],
  selected: Site | undefined
) => {
  if (fetchedStatus === LoadingStatus.Failed) {
    return <FormattedMessage {...messages.sitesFailedToLoadMessage} />;
  } else if (fetchedStatus === LoadingStatus.Success && selected) {
    return selected.cloudName;
  } else if (fetchedStatus === LoadingStatus.Success && sites.length === 0) {
    return <FormattedMessage {...messages.noSitesMessage} />;
  }
  return '';
};

export const SiteChooser = ({
  fetchedStatus,
  isDisabled,
  onSelectedChange,
  selected,
  sites,
}: Props) => {
  const intl = useIntl();

  // We don't need to render a chooser if there is only one site.
  if (fetchedStatus === LoadingStatus.Success && sites.length === 1) {
    return <SiteLabel>{sites[0].cloudName}</SiteLabel>;
  }

  return (
    // @ts-ignore fix value type
    <PopupSelect
      closeMenuOnSelect
      // @ts-ignore TODO: fix noImplicitAny error here
      styles={{ container: styles => ({ ...styles, maxWidth: 600 }) }}
      maxMenuHeight={400}
      spacing="compact"
      isLoading={isLoading(fetchedStatus)}
      isDisabled={isDisabled}
      onClickPreventDefault={false}
      backspaceRemovesValue={false}
      value={
        selected
          ? {
              label: selected.cloudName,
              value: selected.cloudId,
              site: selected,
            }
          : undefined
      }
      onChange={({ site }: { site: Site }) => {
        onSelectedChange(site);
        publishUiEvent({
          action: 'changed',
          actionSubject: 'option',
          actionSubjectId: 'createJiraIssueSiteChooser',
          source: 'pullRequestScreen',
        });
      }}
      options={[
        {
          label: intl.formatMessage(messages.sitesHeader),
          options: sites.map(site => ({
            label: site.cloudName,
            value: site.cloudId,
            site,
          })),
        },
      ]}
      searchThreshold={10}
      noOptionsMessage={() => targetLabel(fetchedStatus, sites, selected)}
      // @ts-ignore TODO: fix noImplicitAny error here
      target={({ ref }) => (
        <TargetButton
          appearance="subtle"
          ref={ref}
          iconAfter={
            isLoading(fetchedStatus) ? (
              <Spinner size="small" />
            ) : (
              <DownIconWrapper>
                <DownIcon label="expand site chooser" />
              </DownIconWrapper>
            )
          }
          spacing="compact"
        >
          <TargetButtonText>
            {targetLabel(fetchedStatus, sites, selected)}
          </TargetButtonText>
        </TargetButton>
      )}
    />
  );
};
