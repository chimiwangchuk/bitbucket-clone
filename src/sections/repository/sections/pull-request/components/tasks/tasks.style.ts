import styled from '@emotion/styled';
import { gridSize, typography, colors } from '@atlaskit/theme';
import { css } from '@emotion/core';
import { dividerColor } from 'src/components/cards/dropdown-expander/dropdown-expander.style';

export const TaskNumber = styled.span`
  font-weight: bold;
`;

// override AK Checkbox styles to force checkbox
// labels to wrap within their container correctly
export const TaskCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;

  label {
    flex-grow: 1;
    max-width: 90%;

    & > span:nth-of-type(2) {
      overflow-wrap: break-word;
      width: 90%;
      word-wrap: break-word;
    }
  }
`;

export const TaskCardFooter = styled.div<{ kind: 'edit' | 'save' }>`
  display: flex;
  align-items: center;
  justify-content: ${({ kind }) =>
    kind === 'edit' ? 'center' : 'space-between'};
  width: 100%;
  box-sizing: border-box;
  margin-top: ${gridSize()}px;
  padding-top: ${gridSize()}px;
  padding-left: ${gridSize()}px;
  padding-right: ${gridSize()}px;
  border-top: 1px solid ${dividerColor};
`;

export const TaskContainer = styled.li`
  margin-top: ${gridSize()}px;
  &:not(:last-of-type) {
    margin-bottom: ${gridSize()};
  }
  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const TaskList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

export const TaskModificationLinks = styled.ul<{ hasSeparator?: boolean }>`
  /* padding lines the task edit/delete links up with the task text */
  padding: 0 0 0 ${gridSize() * 3.5}px;
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;

  /* "> li" needed for specificity to apply margin 0 */
  & > li {
    margin: 0;
    display: flex;
    align-items: center;

    ${({ hasSeparator }) =>
      hasSeparator
        ? css`
            &:not(:last-of-type)::after {
              color: inherit;
              content: '·';
              display: inline-block;
              text-align: center;
              vertical-align: middle;
              width: ${gridSize() * 2}px;
            }
          `
        : ''}
  }
`;

export const EditCommentTaskErrorMessage = styled.div`
  ${typography.h200() as any};
  font-weight: normal;
  color: ${colors.R400};
  margin-top: ${gridSize() / 2}px;
  margin-left: ${gridSize() * 5}px;
`;
