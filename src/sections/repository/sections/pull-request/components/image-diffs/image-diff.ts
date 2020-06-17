import { connect } from 'react-redux';

import { ImageDiff } from 'src/components/image-diffs';
import { TOGGLE_DIFF_EXPANSION } from 'src/redux/pull-request/actions';
import {
  getCurrentPullRequestUrlPieces,
  getPullRequestDestinationHash,
  getPullRequestSourceHash,
} from 'src/redux/pull-request/selectors';
import { getIsHorizontalNavEnabled } from 'src/selectors/feature-selectors';
import { getCombinedBannerAndHorizontalNavHeight } from 'src/selectors/global-selectors';

import { BucketState, BucketDispatch } from 'src/types/state';
import {
  extractFilepath,
  extractPrevFilepath,
} from 'src/utils/extract-file-path';

import { STICKY_HEADER_HEIGHT_OFFSET } from '../utils/calculate-header-offset';

import { OwnProps, StateProps, DispatchProps, MergedProps } from './types';
import { getSourceUrls } from './utils';

export function mapStateToProps(
  state: BucketState,
  ownProps: OwnProps
): StateProps {
  const isHorizontalNavEnabled = getIsHorizontalNavEnabled(state);
  let stickyHeaderOffset = getCombinedBannerAndHorizontalNavHeight(
    state,
    false
  );

  if (!isHorizontalNavEnabled) {
    stickyHeaderOffset += STICKY_HEADER_HEIGHT_OFFSET;
  }

  const { owner, slug } = getCurrentPullRequestUrlPieces(state);
  const prDestinationHash = getPullRequestDestinationHash(state);
  const prSourceHash = getPullRequestSourceHash(state);
  const { file } = ownProps;

  const { afterUrl, beforeUrl } = getSourceUrls({
    file,
    sourceHash: prSourceHash || '',
    destinationHash: prDestinationHash || '',
    fileDiffStatus: file.fileDiffStatus,
    repoFullName: `${owner}/${slug}`,
  });

  return {
    afterUrl,
    beforeUrl,
    stickyHeaderOffset,
  };
}

export function mapDispatchToProps(dispatch: BucketDispatch): DispatchProps {
  return {
    onExpand: (filepath: string, isOpening: boolean) =>
      dispatch({
        type: TOGGLE_DIFF_EXPANSION,
        payload: { filepath, isOpening },
      }),
  };
}

export function mergeProps(
  stateProps: StateProps,
  dispatchProps: DispatchProps,
  ownProps: OwnProps
): MergedProps {
  const { onExpand, ...otherDispatchProps } = dispatchProps;
  const { isOpen, file } = ownProps;
  const filepath = extractFilepath(file);

  return {
    ...stateProps,
    ...otherDispatchProps,
    filepath,
    toggleExpanded: () => onExpand(filepath, !isOpen),
    prevFilepath: extractPrevFilepath(file),
    ...ownProps,
  };
}

export default connect<StateProps, DispatchProps, OwnProps, MergedProps>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ImageDiff);
