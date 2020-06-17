import React, { PureComponent } from 'react';
import BranchIcon from '@atlaskit/icon/glyph/bitbucket/branches';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import * as styles from './branch-graphic.style';

export const branchColors = {
  targetBranch: {
    highlight: colors.N300,
    dim: colors.N40,
  },
  newBranch: {
    highlight: colors.B300,
    dim: colors.B50,
  },
};

type Props = {
  targetBranchName: string | null | undefined;
  newBranchName: string | null | undefined;
};

export class BranchGraphic extends PureComponent<Props> {
  renderSvg() {
    const { newBranchName, targetBranchName } = this.props;
    const highlight = newBranchName && targetBranchName;

    const targetBranchColor = highlight
      ? branchColors.targetBranch.highlight
      : branchColors.targetBranch.dim;
    const newBranchColor = highlight
      ? branchColors.newBranch.highlight
      : branchColors.newBranch.dim;

    return (
      <svg width="141.53846154px" height="60px" viewBox="0 0 92 39">
        <g stroke="none" strokeWidth="1" fill="none">
          <g id="branch-diagram-create">
            <path
              d="M86,36 C87.6568542,36 89,34.6568542 89,33 C89,31.3431458 87.6568542,30 86,30 C84.3431458,30 83,31.3431458 83,33 C83,34.6568542 84.3431458,36 86,36 Z M80.1081488,34.1399309 C65.7396146,32.2267058 58.0992007,22.7452367 57.5009625,6.05372681 L60.4990375,5.94627319 C61.0417803,21.0894001 67.5381337,29.3713241 80.2936839,31.1405887 C81.0763531,28.7370585 83.3353207,27 86,27 C89.3137085,27 92,29.6862915 92,33 C92,36.3137085 89.3137085,39 86,39 C83.076066,39 80.6406301,36.9084914 80.1081488,34.1399309 Z"
              id="Combined-Shape"
              fill={targetBranchColor}
              fillRule="nonzero"
            />
            <path
              d="M53.3414114,8 L11.6585886,8 C10.8349158,10.3303847 8.61243765,12 6,12 C2.6862915,12 0,9.3137085 0,6 C0,2.6862915 2.6862915,0 6,0 C8.61243765,0 10.8349158,1.66961525 11.6585886,4 L53.3414114,4 C54.1650842,1.66961525 56.3875623,0 59,0 C62.3137085,0 65,2.6862915 65,6 C65,9.3137085 62.3137085,12 59,12 C56.3875623,12 54.1650842,10.3303847 53.3414114,8 Z"
              id="Combined-Shape"
              fill={newBranchColor}
            />
          </g>
        </g>
      </svg>
    );
  }

  renderLabel = (branchName: string, dataQa: string) => {
    return (
      <styles.BranchLabelWrapper>
        <Tooltip content={branchName} position="bottom">
          <styles.BranchLabel>
            <BranchIcon label="" />
            <span data-qa={dataQa}>{branchName}</span>
          </styles.BranchLabel>
        </Tooltip>
      </styles.BranchLabelWrapper>
    );
  };

  renderLabels() {
    const { newBranchName, targetBranchName } = this.props;
    if (!targetBranchName) {
      return null;
    }

    return (
      <styles.BranchLabels>
        {targetBranchName &&
          this.renderLabel(
            targetBranchName,
            'create-branch-graphic-from-branch'
          )}
        {newBranchName &&
          this.renderLabel(newBranchName, 'create-branch-graphic-new-branch')}
      </styles.BranchLabels>
    );
  }

  render() {
    return (
      <styles.BranchGraphic>
        {this.renderSvg()}
        {this.renderLabels()}
      </styles.BranchGraphic>
    );
  }
}
