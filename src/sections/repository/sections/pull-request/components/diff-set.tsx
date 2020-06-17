import { Grid, GridColumn } from '@atlaskit/page';
import { ThemeProps } from '@atlaskit/page/dist/esm/types';
import React, { Component } from 'react';
import Observer from 'react-intersection-observer';
import { injectIntl, InjectedIntl, FormattedMessage } from 'react-intl';

import { getExcludedPattern } from 'src/utils/get-excluded-pattern';
import { getFileDiffSize } from 'src/utils/get-file-diff-size';
import { Diff } from 'src/types/pull-request';
import { getFileHref } from 'src/utils/get-file-href';
import { extractFilepath } from 'src/utils/extract-file-path';
import { DiffStateMap } from 'src/redux/pull-request/actions/diffs-expansion';
import { getPageLoadType } from 'src/components/performance-metrics/get-page-load-type';
import { countChunkLines } from 'src/utils/count-diff-lines';
import {
  isBinaryDiff,
  isEmptyDiff,
  isExcessiveSizeDiff,
  isFileRenamedDiff,
  isImageDiff,
} from 'src/utils/diff-classifications';
import waitForReactRender from 'src/utils/wait-for-react-render';

import DiffFile from '../containers/diff-file';
import CurrentDiffPlaceholder from '../containers/current-diff-placeholder';
import { PullRequestFactPropertiesSchema } from '../facts';
import { withHeaderVisibilityCheck } from './scrolling-wrapper';

import DiffPlaceholder from './diff-placeholder';
import HiddenDiff from './hidden-diffs/hidden-diff';
import messages from './diff.i18n';

import {
  BinaryDiff,
  EmptyDiff,
  ExcessiveDiff,
  ExcludedDiff,
  FileContentsUnchangedDiff,
} from './hidden-diffs';
import { PullRequestSettingsButton } from './pull-request-settings';

import { STICKY_HEADER_HEIGHT_OFFSET } from './utils/calculate-header-offset';
import * as styles from './diff-set.styled';
import { ImageDiff } from './image-diffs';
import { SingleFileModeSubheading } from './single-file-mode/info-subheading';
import { SingleFileNavigation } from './single-file-mode/single-file-navigation';

export type DiffSetStateProps = {
  activeDiff: string;
  diffsExpansionState: DiffStateMap;
  pullRequestFilemode: string;
  factData: PullRequestFactPropertiesSchema;
  skipExcessiveDiffs: boolean;
  isSingleFileModeActive: boolean;
  isSingleFileModeEligible: boolean;
  anchorTopOffset: number;
  untruncatedDiffFileCount: number;
  untruncatedPullRequestLinesChanged: number;
};

export type DiffSetProps = DiffSetStateProps & {
  files?: Diff[];
  dispatchSettingsHeaderVisibilityChanged: (isVisible: boolean) => void;
  dispatchDiffsHaveRendered: () => void;
  dispatchInitialDiffsRendered: (attributes?: object) => void;
  onDiffScrolledIntoView: (filepath: string) => void;
  onDiffScrolledOutOfView: (filepath: string) => void;
  intl: InjectedIntl;
};

export class DiffSet extends Component<DiffSetProps> {
  static defaultProps = {
    diffsExpansionState: {},
    onMount: () => {},
  };

  componentDidMount() {
    this.props.dispatchInitialDiffsRendered({
      pullRequestFiles: this.props.untruncatedDiffFileCount,
      pullRequestLinesChanged: this.props.untruncatedPullRequestLinesChanged,
      pullRequestFilemode: this.props.pullRequestFilemode,
    });
    // Used to draw a line on the SpeedCurve graphs
    // Note: This is separate performance instrumentation that is only fired on initialLoad and
    // shouldn't be confused with withStatsD() or withApdex()
    waitForReactRender(() => {
      if (getPageLoadType() !== 'full_page') {
        return;
      }
      window.performance.mark('SPEEDCURVE.DIFFS.RENDERED');
    });
  }

  componentDidUpdate() {
    this.props.dispatchDiffsHaveRendered();
  }

  renderDiffWrapper = (file: Diff, index: number, fileHref: string) => {
    const { isSingleFileModeActive, anchorTopOffset } = this.props;

    return (
      <styles.DiffSetFileWrapper
        isSingleFileModeActive={isSingleFileModeActive}
        key={
          isSingleFileModeActive
            ? // keep the key static when in single file mode to avoid re-mount flash
              'single-file-wrapper'
            : file.from + file.to
        }
      >
        <styles.ScrollToAnchor topOffset={anchorTopOffset} id={fileHref} />
        {isSingleFileModeActive ? (
          this.renderDiff(file, index)
        ) : (
          <Observer triggerOnce>
            {inViewOnce => {
              if (inViewOnce) {
                return this.renderDiff(file, index);
              } else {
                return this.renderDiffPlaceholder(file);
              }
            }}
          </Observer>
        )}
      </styles.DiffSetFileWrapper>
    );
  };

  renderDiff(file: Diff, index: number) {
    const { diffsExpansionState, intl } = this.props;
    const filepath = extractFilepath(file);

    const wasExpandedByUser = diffsExpansionState[filepath] === true;
    const untouchedByUser = diffsExpansionState[filepath] === undefined;

    if (file.isFileContentsUnchanged) {
      return (
        <FileContentsUnchangedDiff file={file} isOpen={wasExpandedByUser} />
      );
    }

    if (isImageDiff(file)) {
      return (
        <ImageDiff
          file={file}
          isOpen={wasExpandedByUser || (untouchedByUser && !file.deleted)}
        />
      );
    }

    if (isBinaryDiff(file)) {
      return <BinaryDiff file={file} isOpen={wasExpandedByUser} />;
    }

    const excludedPattern = getExcludedPattern(file);

    if (excludedPattern) {
      return (
        <ExcludedDiff
          file={file}
          pattern={excludedPattern}
          isOpen={wasExpandedByUser}
        />
      );
    }

    if (isFileRenamedDiff(file)) {
      return (
        <HiddenDiff
          file={file}
          isOpen={wasExpandedByUser}
          heading={intl.formatMessage(messages.fileRenamed)}
        />
      );
    }

    if (isEmptyDiff(file)) {
      return <EmptyDiff file={file} isOpen={wasExpandedByUser} />;
    }

    if (this.props.skipExcessiveDiffs && isExcessiveSizeDiff(file)) {
      const fileDiffSize = getFileDiffSize(file);
      return (
        <ExcessiveDiff
          file={file}
          size={fileDiffSize}
          isOpen={wasExpandedByUser}
        />
      );
    }

    return (
      <DiffFile
        file={file}
        fileIndex={index}
        isOpen={wasExpandedByUser || (untouchedByUser && !file.deleted)}
      />
    );
  }

  renderDiffPlaceholder(file: Diff) {
    const { diffsExpansionState } = this.props;
    const excludedPattern = getExcludedPattern(file);
    const filepath = extractFilepath(file);

    const wasExpandedByUser = diffsExpansionState[filepath] === true;
    const untouchedByUser = diffsExpansionState[filepath] === undefined;

    if (excludedPattern || file.isBinary || file.isFileContentsUnchanged) {
      return <DiffPlaceholder lines={0} chunks={0} />;
    }

    return (
      <CurrentDiffPlaceholder
        lines={countChunkLines(file)}
        chunks={file.chunks.length}
        file={file}
        isOpen={wasExpandedByUser || (untouchedByUser && !file.deleted)}
      />
    );
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  handleObserverOnChange = (inView, fileHref) => {
    // diff is 'in view' when just below the sticky header
    if (inView) {
      this.props.onDiffScrolledIntoView(fileHref);
    } else {
      this.props.onDiffScrolledOutOfView(fileHref);
    }
  };

  render() {
    const {
      files,
      intl,
      isSingleFileModeActive,
      isSingleFileModeEligible,
      untruncatedDiffFileCount,
    } = this.props;

    return (
      <section aria-label={intl.formatMessage(messages.diffSetLabel)}>
        <Grid
          spacing="comfortable"
          theme={(theme: ThemeProps) => ({
            ...theme,
            isNestedNavigation: false,
          })}
        >
          <GridColumn data-qa="pr-description-grid-column">
            <styles.SettingsHeader>
              <styles.GroupedSpan>
                <FormattedMessage
                  {...messages.fileCount}
                  values={{ fileCount: untruncatedDiffFileCount }}
                />
                {isSingleFileModeEligible && <SingleFileModeSubheading />}
              </styles.GroupedSpan>
              <styles.GroupedSpan>
                {isSingleFileModeActive && <SingleFileNavigation />}
                <PullRequestSettingsButton />
              </styles.GroupedSpan>
            </styles.SettingsHeader>
          </GridColumn>
        </Grid>
        {(files || []).map((file, index) => {
          const fileHref = getFileHref(extractFilepath(file));

          return isSingleFileModeActive ? (
            this.renderDiffWrapper(file, index, fileHref)
          ) : (
            <Observer
              rootMargin={`-${STICKY_HEADER_HEIGHT_OFFSET}px 0% -90% 0%`}
              key={index}
              onChange={inView => this.handleObserverOnChange(inView, fileHref)}
            >
              {() => this.renderDiffWrapper(file, index, fileHref)}
            </Observer>
          );
        })}
      </section>
    );
  }
}

export default withHeaderVisibilityCheck(injectIntl(DiffSet));
