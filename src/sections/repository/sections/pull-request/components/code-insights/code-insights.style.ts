import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, gridSize, borderRadius, elevation } from '@atlaskit/theme';
import { overflowEllipsis } from 'src/styles/mixins';

export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const EmptyStateImage = styled.img`
  margin: ${2 * gridSize()}px auto;
  display: block;
  width: 50%;
  height: 50%;
`;

export const EmptyStateMessage = styled.p`
  width: 100%;
  margin: 0 0 ${2 * gridSize()}px;
  padding: 0 ${gridSize()}px;
`;

export const EmptyStateLearnMore = styled.div`
  border-top: 1px ${colors.N30} solid;
  box-sizing: border-box;
  width: 100%;
  height: ${5 * gridSize()}px;
  padding-top: ${gridSize()}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const UnknownIcon = styled.div`
  height: ${3 * gridSize()}px;
  width: ${3 * gridSize()}px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: ${2 * gridSize()}px;
    height: ${2 * gridSize()}px;
    background: ${colors.N20};
    border-radius: 100%;
    margin: -${gridSize()}px 0 0 -${gridSize()}px;
    top: 50%;
    left: 50%;
  }
`;

export type CardItemWrapperProps = {
  isActive?: boolean;
  isModalView?: boolean;
};

const activeStyles = css`
  background-color: ${colors.N20};
  font-weight: bold;
`;

const modalStyles = css`
  padding: ${gridSize()}px ${gridSize()}px ${gridSize()}px 0;
  justify-content: space-between;
  margin: 0;
  color: ${colors.B400};
`;

export const CardItemWrapper = styled.div<CardItemWrapperProps>`
  display: flex;
  align-items: center;
  margin: ${gridSize()}px 0;
  cursor: pointer;
  ${({ isActive }) => isActive && activeStyles}
  ${({ isModalView }) => isModalView && modalStyles}

  &:focus {
    outline: solid 2px ${colors.B100};
  }
`;

export const CardItemTitle = styled.span`
  margin-left: ${gridSize()}px;
  ${overflowEllipsis()}
`;

export const ModalWrapper = styled.div`
  display: flex;
  padding-bottom: ${4 * gridSize()}px;
  min-height: 500px;
  height: 100%;
  align-items: stretch;
  box-sizing: border-box;
`;

export const ModalSidebar = styled.div`
  width: ${25 * gridSize()}px;
  flex-shrink: 0;
  flex-grow: 0;
`;

export const ModalContent = styled.div`
  border-left: 2px ${colors.N30} solid;
  margin-left: ${2 * gridSize()}px;
  padding-left: ${2 * gridSize()}px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;

  table {
    table-layout: fixed;
  }

  tbody {
    border-bottom-width: 0;
  }
`;

export const ReporterInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: ${2 * gridSize()}px;
`;

export const ReporterLogo = styled.div`
  width: ${3 * gridSize()}px;
  height: ${3 * gridSize()}px;
  background-color: ${colors.N20};

  img {
    width: 100%;
    height: 100%;
  }
`;

export const ReporterTitle = styled.h4`
  margin: 0 0 0 ${gridSize()}px;
  ${overflowEllipsis()}
  flex: 1;
`;

export const ReporterDate = styled.div`
  margin-top: ${gridSize()}px;
  font-size: ${1.5 * gridSize()}px;
  color: ${colors.N500};
  width: 100%;
  word-break: brea-word;
`;

export const ReporterDetails = styled.p`
  color: ${colors.N500};
  width: 100%;
`;

export const AnnotationRow = styled.tr`
  &:active,
  &:hover,
  &:focus {
    background-color: ${colors.N20};

    td {
      visibility: visible;
    }
  }
`;

export const HeadCell = styled.td`
  font-size: ${1.5 * gridSize()}px;
  color: ${colors.N500};
  font-weight: 300;
`;

export const HeadExpanderCell = styled(HeadCell)`
  width: ${1.5 * gridSize()}px;
`;

export const HeadResultCell = styled(HeadCell)`
  width: ${8 * gridSize()}px;
  padding-left: 0;
`;

export const HeadSeverityCell = styled(HeadCell)`
  width: ${8 * gridSize()}px;
`;

export const HeadSummaryCell = styled(HeadCell)`
  width: ${28 * gridSize()}px;
`;

export const HeadPathCell = styled(HeadCell)`
  width: ${13 * gridSize()}px;
`;

export const HeadLinkCell = styled(HeadCell)`
  width: ${2 * gridSize()}px;
`;

export const BodyCell = styled.td`
  padding: ${gridSize()}px;
`;

export const BodyExpanderCell = styled(BodyCell)`
  padding-right: 0;
`;

export const BodyResultCell = styled(BodyCell)`
  text-transform: capitalize;
  padding-left: 0;
`;

export const BodySeverityCell = styled(BodyCell)`
  text-transform: capitalize;
`;

export const AnnotationSummary = styled.div`
  ${overflowEllipsis()}
`;

export const BodyPathCell = styled(BodyCell)`
  word-break: break-all;
`;

export const BodyLinkCell = styled(BodyCell)`
  padding-left: 0;
  visibility: hidden;
`;

export const SeverityInfo = styled.div`
  display: flex;
  align-items: center;
  img {
    margin-right: ${gridSize()}px;
  }
`;

export const DetailsCell = styled.td`
  padding: 0;
`;

export const DetailsWrapper = styled.div`
  padding: ${2 * gridSize()}px ${gridSize()}px;
  font-size: ${1.5 * gridSize()}px;
`;

export const ReporterMetadataWrapper = styled.div`
  display: flex;
  margin: ${2 * gridSize()}px 0;
  flex-wrap: wrap;
`;

export const ReporterMetadataItem = styled.dl`
  padding: 0 ${4 * gridSize()}px 0 0;
  margin: 0 0 ${gridSize() / 2}px;
  width: 50%;
  box-sizing: border-box;
  ${overflowEllipsis()};
  margin-bottom: ${gridSize() / 2}px;
  display: flex;
  dt {
    margin: 0;
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  dd {
    margin: 0 0 0 ${gridSize() / 2}px;
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    white-space: nowrap;
  }
`;

export const ExternalLink = styled.div`
  display: flex;
`;

export const PendingState = styled.div`
  font-weight: bold;
  text-align: center;
  padding: ${2 * gridSize()}px 0;
`;

const expandedStyles = css`
  transform: rotateZ(90deg);
`;

/* remove this disable once https://github.com/YozhikM/stylelint-a11y/issues/38 is addressed */
/* stylelint-disable a11y/media-prefers-reduced-motion */
export const AnnotationExpander = styled.div`
  width: ${2 * gridSize()}px;
  height: ${2 * gridSize()}px;
  transform: translate3d(0, 0, 0);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  ${({ isExpanded }: { isExpanded: boolean }) => isExpanded && expandedStyles}

  @media screen and (prefers-reduced-motion: reduce) {
    /* https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/ */
    transition-duration: 0.001ms;
  }
`;
/* stylelint-enable */

export const ResultWrapper = styled.div`
  display: flex;
`;

export const ResultIconWrapper = styled.div`
  width: ${3 * gridSize()}px;
  height: ${3 * gridSize()}px;
  margin: -${gridSize() / 4}px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResultText = styled.div`
  display: flex;
  padding-left: ${gridSize() / 2}px;
`;

export const ReportLockedWrapper = styled.div`
  text-align: center;
  margin: ${gridSize() * 2}px 0;
`;

export const UpgradeCardWrapper = styled.div`
  padding: ${gridSize() * 3}px ${gridSize() * 4}px;
  margin: ${gridSize() * 4}px auto 0;
  width: ${gridSize() * 50}px;
  border-radius: ${borderRadius()}px;
  position: relative;
  ${elevation.e200()}
  display: flex;
  flex-wrap: wrap;
  text-align: left;
`;

export const UpgradeCardIcon = styled.div`
  width: ${gridSize() * 4}px;
`;

export const UpgradeCardContent = styled.div`
  flex: 1;
  p {
    margin: ${gridSize() * 2}px 0;
  }
`;

export const UpgradeCardButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  a {
    margin-left: ${gridSize()}px;
  }
`;
