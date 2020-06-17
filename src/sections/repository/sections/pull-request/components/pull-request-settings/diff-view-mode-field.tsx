import Select from '@atlaskit/select';
// @ts-ignore TODO: Upgrade @atlaskit/select to get types
import {
  OptionType,
  OptionsType,
  SelectProps,
} from '@atlaskit/select/dist/esm/';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useIntl } from 'src/hooks/intl';
import { DiffViewMode } from 'src/redux/pull-request-settings';
import { getSiteMessageBanner } from 'src/selectors/global-selectors';
import { BucketState } from 'src/types/state';

import { ResponsiveSideBySideModeDisabledTooltip } from '../responsive-side-by-side-mode-disabled-tooltip';
import messages from './i18n';
import { Field, useSelectStyles } from './styled';
import { usePullRequestSettingsForm } from './pull-request-settings-form';

export const DiffViewModeField = React.memo(
  (props: SelectProps<OptionType>) => {
    const intl = useIntl();

    const isSiteBannerOpen = useSelector<BucketState, boolean>(
      getSiteMessageBanner
    );

    const [formState, setFormState] = usePullRequestSettingsForm();

    const handleChange = useCallback(
      (option: OptionType) => {
        const diffViewMode =
          option.value === DiffViewMode.SideBySide
            ? DiffViewMode.SideBySide
            : DiffViewMode.Unified;
        setFormState(state => ({ ...state, diffViewMode }));
      },
      [setFormState]
    );

    const diffViewModeOptions: OptionsType = useMemo(
      () => [
        {
          label: intl.formatMessage(messages.diffViewModeLabelUnified),
          value: DiffViewMode.Unified,
        },
        {
          label: intl.formatMessage(messages.diffViewModeLabelSideBySide),
          value: DiffViewMode.SideBySide,
        },
      ],
      [intl]
    );

    const styles = useSelectStyles(isSiteBannerOpen);

    const diffViewModeId = 'diff-view-mode';
    const diffViewModeLabelId = `${diffViewModeId}-label`;

    return (
      <Field>
        <label htmlFor={diffViewModeId} id={diffViewModeLabelId}>
          {intl.formatMessage(messages.diffViewModeLabel)}
        </label>
        <ResponsiveSideBySideModeDisabledTooltip position="top">
          {(isSideBySideModeDisabled: boolean) => (
            <Select
              {...props}
              inputId={diffViewModeId}
              isDisabled={props.isDisabled || isSideBySideModeDisabled}
              isSearchable={false}
              menuPortalTarget={document.body}
              name="diffViewMode"
              onChange={handleChange}
              options={diffViewModeOptions}
              styles={styles}
              value={diffViewModeOptions.find(
                (option: OptionType) => option.value === formState.diffViewMode
              )}
            />
          )}
        </ResponsiveSideBySideModeDisabledTooltip>
      </Field>
    );
  }
);
