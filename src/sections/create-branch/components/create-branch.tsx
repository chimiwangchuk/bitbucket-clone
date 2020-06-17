import { sortBy } from 'lodash-es';
import React, { Fragment } from 'react';
import { FormattedMessage, InjectedIntl } from 'react-intl';
import { FieldTextStateless } from '@atlaskit/field-text';
import InfoIcon from '@atlaskit/icon/glyph/info';
import InlineDialog from '@atlaskit/inline-dialog';
// @ts-ignore TODO: fix noImplicitAny error here
import Select from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';
import { BuildStatus as Builds } from '@atlassian/bitkit-builds';
import { publishUiEvent } from 'src/utils/analytics/publish';

import { getModalMenuPortalStyles } from 'src/styles/select';
import {
  EXTENDED_BRANCH_KINDS,
  BRANCH_TYPE_OTHER,
  CREATE_BRANCH_ERROR_TYPE,
  LOADING_STATE,
  REF_TYPE,
  CREATE_FROM,
} from '../constants';
import {
  BranchType,
  BranchTypeSelector,
  CreateBranchError,
  CreateBranchParams,
  Ref,
  RefSelector,
  RepositorySelector,
  SelectOption,
  WorkflowBranches,
} from '../types';
import urls from '../urls';
import { areRefsSame } from '../utils';
import SelectBranch from '../containers/select-branch';
import messages from './create-branch.i18n';
import { BranchGraphic } from './branch-graphic';
import * as styles from './create-branch.style';
import SelectRepository from './select-repository';

const BRANCHING_MODEL_TYPE_LABEL = {
  bugfix: messages.branchTypeBugfixOptionLabel,
  feature: messages.branchTypeFeatureOptionLabel,
  hotfix: messages.branchTypeHotfixOptionLabel,
  release: messages.branchTypeReleaseOptionLabel,
  other: messages.branchTypeOtherOptionLabel,
};

const BRANCH_TYPE_ORDER = ['bugfix', 'feature', 'hotfix', 'release'];

type CreateBranchProps = {
  branchTypeSelector: BranchTypeSelector;
  intl: InjectedIntl;
  isCreating: boolean;
  createParams: CreateBranchParams;
  newBranchName: string;
  refSelector: RefSelector;
  error: CreateBranchError | null | undefined;
  workflowBranches: WorkflowBranches;
  onFetchCommitStatuses: () => void;
  onChangeFromBranch: (branch: Ref) => void;
  onChangeNewBranchName: (name: string) => void;
  onChangeBranchType: (branchType: BranchType) => void;
  isBannerOpen: boolean;
  createFrom: CREATE_FROM;
  onChangeRepository: (payload: SelectOption) => void;
  repositorySelector: RepositorySelector;
};

type CreateBranchState = {
  isBranchTypeSelectorHelpShown: boolean;
};

export class CreateBranch extends React.PureComponent<
  CreateBranchProps,
  CreateBranchState
> {
  branchNameInputRef: HTMLInputElement | null | undefined;

  state = {
    isBranchTypeSelectorHelpShown: false,
  };

  componentDidUpdate(prevProps: CreateBranchProps) {
    const { onFetchCommitStatuses, error, createParams } = this.props;

    const prevRefHash = ((prevProps.createParams.target as Ref) || {}).hash;
    const currRefHash = ((createParams.target as Ref) || {}).hash;
    if (prevRefHash !== currRefHash && currRefHash) {
      onFetchCommitStatuses();
    }

    // Focus on the branch name input field if new state contains related error
    if (
      this.branchNameInputRef &&
      !prevProps.error &&
      error &&
      error.type in this.branchNameErrorMessages
    ) {
      this.branchNameInputRef.focus();
    }
  }

  handleChangeFromBranch = (ref: Ref) => {
    this.publishEventForChangeFromBranch(ref);

    this.props.onChangeFromBranch(ref);
  };

  publishEventForChangeFromBranch = (newFromBranch: Ref) => {
    const {
      refSelector: { selected, suggestedRef },
      branchTypeSelector: { selected: selectedBranchType, branchTypes },
      workflowBranches: { development, production },
    } = this.props;

    const previous = selected ? selected.ref : null;

    if (!previous || !newFromBranch || previous === newFromBranch) {
      // `previous === newFromBranch` is the case when the dropdown is opened and the existing selected option is chosen.
      // We don't want to send an analytics event for that.
      return;
    }

    const branchType = (ref: Ref): string | null | undefined => {
      if (ref.type === REF_TYPE.TAG) {
        return 'tag';
      }
      // Check if branch name is one of development or production
      if (development && areRefsSame(ref, development)) {
        return 'development';
      } else if (production && areRefsSame(ref, production)) {
        return 'production';
      }

      if (!branchTypes.length) {
        return null;
      }
      // Check if branch name matches a prefix
      const type = branchTypes.find(t => ref.name.indexOf(t.prefix) === 0);
      return type ? type.kind : BRANCH_TYPE_OTHER.kind;
    };

    const isDefault = (ref: Ref): boolean =>
      suggestedRef ? areRefsSame(ref, suggestedRef) : false;

    const attributes = {
      branchType: selectedBranchType ? selectedBranchType.kind : null,
      newIsDefault: isDefault(newFromBranch),
      newType: branchType(newFromBranch),
      previousIsDefault: isDefault(previous),
      previousType: branchType(previous),
    };

    publishUiEvent({
      action: 'changed',
      actionSubject: 'option',
      actionSubjectId: 'fromBranchSelect',
      source: 'createBranchScreen',
      attributes,
    });
  };

  branchTypeOption = (branchType: BranchType, isSelected = false) => {
    const message = this.props.intl.formatMessage(
      BRANCHING_MODEL_TYPE_LABEL[branchType.kind]
    );

    const label = isSelected
      ? message
      : this.branchTypeOptionLabel(branchType, message);

    return {
      label,
      value: branchType,
    };
  };

  branchTypeOptionLabel = (branchType: BranchType, message: string) => {
    if (branchType.kind === EXTENDED_BRANCH_KINDS.OTHER) {
      return (
        <styles.BranchTypeOptionOther data-qa="create-branch-type-option">
          {message}
        </styles.BranchTypeOptionOther>
      );
    } else {
      return <span data-qa="create-branch-type-option">{message}</span>;
    }
  };

  getSelectedBranchType = () => {
    const { selected } = this.props.branchTypeSelector;
    if (selected) {
      return this.branchTypeOption(selected, true);
    } else {
      return this.branchTypeOption(BRANCH_TYPE_OTHER, true);
    }
  };

  getBranchTypeOptions = () => {
    const { branchTypes } = this.props.branchTypeSelector;
    const options = sortBy(branchTypes, [
      type => BRANCH_TYPE_ORDER.indexOf(type.kind),
    ]).map(type => this.branchTypeOption(type));
    if (options.length > 0) {
      options.push(this.branchTypeOption(BRANCH_TYPE_OTHER));
    }
    return options;
  };

  setHelpShown = (showHelp: boolean) =>
    this.setState({ isBranchTypeSelectorHelpShown: showHelp });

  renderBranchTypeSelectorLabel = (htmlFor: string) => {
    const { intl } = this.props;
    const { isBranchTypeSelectorHelpShown: helpShown } = this.state;

    const tooltipContent = (
      <styles.BranchTypeSelectorTooltipContent>
        <p>
          <FormattedMessage {...messages.branchTypeTooltipText} />
        </p>
        <p>
          <a
            href={urls.external.docs()}
            target="_blank"
            onClick={() => this.setHelpShown(false)}
          >
            <FormattedMessage {...messages.branchTypeTooltipLearnMoreLink} />
          </a>
        </p>
      </styles.BranchTypeSelectorTooltipContent>
    );

    return (
      <Fragment>
        <styles.FormLabel htmlFor={htmlFor}>
          {intl.formatMessage(messages.branchTypeLabel)}
        </styles.FormLabel>
        <styles.BranchTypeSelectorIconWrapper>
          <InlineDialog
            content={tooltipContent}
            isOpen={helpShown}
            onClose={() => this.setHelpShown(false)}
            placement="right-start"
          >
            <styles.CursorPointer
              type="button"
              onClick={() => this.setHelpShown(!helpShown)}
            >
              <InfoIcon size="small" label="" />
            </styles.CursorPointer>
          </InlineDialog>
        </styles.BranchTypeSelectorIconWrapper>
      </Fragment>
    );
  };

  hasBuildStatuses = () =>
    this.props.refSelector.selectedCommitStatuses &&
    this.props.refSelector.selectedCommitStatuses.length > 0;

  renderApiErrorMessage = () => {
    const { error } = this.props;
    return <span>{error && error.message}</span>;
  };

  branchNameErrorMessages = {
    [CREATE_BRANCH_ERROR_TYPE.BRANCH_ALREADY_EXISTS]: () => {
      return (
        <FormattedMessage {...messages.errorDescriptionBranchAlreadyExists} />
      );
    },
    // For these errors we simply show the message returned in API response
    [CREATE_BRANCH_ERROR_TYPE.BRANCH_PERMISSION_VIOLATED]: () =>
      this.renderApiErrorMessage(),
    [CREATE_BRANCH_ERROR_TYPE.INVALID_BRANCH_NAME]: () =>
      this.renderApiErrorMessage(),
  };

  renderInvalidBranchNameMessage = () => {
    const { error } = this.props;
    if (error) {
      const type = Object.keys(this.branchNameErrorMessages).find(
        t => t === error.type
      );
      if (type) {
        return (
          <styles.BranchNameError>
            {(this.branchNameErrorMessages as any)[type]()}
          </styles.BranchNameError>
        );
      }
    }

    return null;
  };

  renderBranchNameInputField = () => {
    const branchType = this.getSelectedBranchType();
    const prefix = branchType && branchType.value.prefix;

    const errorMessage = this.renderInvalidBranchNameMessage();

    return (
      <styles.BranchNameInputWrapper>
        {!!prefix && (
          <styles.BranchNamePrefix>
            <Tooltip content={prefix} position="bottom">
              <span id="branch-name-prefix">{prefix}</span>
            </Tooltip>
          </styles.BranchNamePrefix>
        )}
        <styles.BranchNameInput>
          <FieldTextStateless
            name="branchName"
            onChange={(e: any) =>
              this.props.onChangeNewBranchName(e.target.value)
            }
            disabled={this.props.isCreating}
            autoComplete="off"
            shouldFitContainer
            autoFocus
            isLabelHidden
            value={this.props.createParams.name}
            isInvalid={!!errorMessage}
            invalidMessage={errorMessage}
            innerRef={ref => {
              this.branchNameInputRef = ref;
            }}
          />
        </styles.BranchNameInput>
      </styles.BranchNameInputWrapper>
    );
  };

  renderRepositorySelector = () => {
    return this.props.createFrom === CREATE_FROM.GLOBAL_PAGE ||
      this.props.createFrom === CREATE_FROM.GLOBAL_DIALOG ? (
      <SelectRepository
        repositorySelector={this.props.repositorySelector}
        intl={this.props.intl}
        isCreating={this.props.isCreating}
        onChangeRepository={this.props.onChangeRepository}
      />
    ) : null;
  };

  render() {
    const {
      intl,
      isCreating,
      refSelector,
      createParams,
      onChangeBranchType,
      branchTypeSelector,
      isBannerOpen,
    } = this.props;

    const isLoading =
      branchTypeSelector.loadingState === LOADING_STATE.LOADING ||
      refSelector.loadingState === LOADING_STATE.LOADING;

    const targetName = (createParams.target && createParams.target.name) || '';
    const branchTypeId = 'select-branch-type';

    const selectStyles = getModalMenuPortalStyles(isBannerOpen);

    return (
      <div data-qa={!isLoading ? 'create-branch-loaded' : ''}>
        {this.renderRepositorySelector()}
        {branchTypeSelector.isVisible && (
          <styles.FieldWrapper>
            {this.renderBranchTypeSelectorLabel(branchTypeId)}
            <Select
              id={branchTypeId}
              isDisabled={isCreating || isLoading}
              isLoading={isLoading}
              options={this.getBranchTypeOptions()}
              value={this.getSelectedBranchType()}
              // @ts-ignore TODO: fix noImplicitAny error here
              onChange={option => onChangeBranchType(option.value)}
              onClickPreventDefault={false}
              menuPortalTarget={document.body}
              styles={selectStyles}
            />
          </styles.FieldWrapper>
        )}

        <styles.FieldWrapper id="select-branch">
          <styles.FormLabel>
            {intl.formatMessage(messages.fromBranchLabel)}
          </styles.FormLabel>
          <styles.FieldRefSelector>
            <styles.FieldRefSelectorDropdown>
              <SelectBranch
                intl={intl}
                refSelector={refSelector}
                isCreating={isCreating}
                isLoading={isLoading}
                onChangeFromBranch={this.handleChangeFromBranch}
                selectStyles={selectStyles}
              />
            </styles.FieldRefSelectorDropdown>
            {this.hasBuildStatuses() && (
              <styles.FieldRefSelectorBuildStatus>
                <Builds builds={refSelector.selectedCommitStatuses} />
              </styles.FieldRefSelectorBuildStatus>
            )}
          </styles.FieldRefSelector>
        </styles.FieldWrapper>

        <styles.FieldWrapper>
          <styles.FormLabel>
            {intl.formatMessage(messages.branchNameLabel)}
          </styles.FormLabel>
          {this.renderBranchNameInputField()}
        </styles.FieldWrapper>

        <BranchGraphic
          targetBranchName={targetName}
          newBranchName={this.props.newBranchName}
        />
      </div>
    );
  }
}
