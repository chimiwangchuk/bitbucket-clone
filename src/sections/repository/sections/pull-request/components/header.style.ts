import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';
import { media } from '@atlassian/bitkit-responsive';

const FLEX_WRAP_MARGIN = gridSize() * 2;

export const Avatar = styled.div`
  margin-right: ${gridSize()}px;
`;

export const Details = styled.div`
  overflow: auto;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: ${gridSize() * 2}px;

  /* we need to compensate margin, so it will be visible only on wrap */
  margin-top: -${FLEX_WRAP_MARGIN}px;
`;

export const PullRequestInfo = styled.div`
  text-align: left;
`;

export const PullRequestDates = styled.small`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: ${gridSize() / 2}px;
  white-space: nowrap;
  ${media.upToSmall(`
    max-width: ${gridSize() * 31}px;
  `)}
`;

export const PullRequestAuthor = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${FLEX_WRAP_MARGIN}px;
  margin-right: ${gridSize()}px;
  ${media.upToSmall(`
    margin-right: 0;
  `)}
`;

export const ButtonsWrapper = styled.div`
  margin-top: ${FLEX_WRAP_MARGIN}px;
  margin-left: auto;
`;
