import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const EditTaskList = styled.ul<{ hasError: boolean }>`
  margin-bottom: ${({ hasError }) =>
    hasError ? gridSize() * 1 : gridSize() * 2}px;
  padding-left: 0;
  list-style: none;
`;

const checkboxLabelPadding = gridSize() / 4;
const checkboxHeight = gridSize() * 3;
const textareaDefaultHeight = 36;
const checkboxOffset =
  textareaDefaultHeight - checkboxHeight - checkboxLabelPadding;

export const EditTaskContainer = styled.li`
  margin: ${gridSize() / 2}px 0;

  & label {
    /**
     * Vertically center the checkbox with the default height
     * of the textarea.
     *
     * This is an alternative to using a negative margin on the
     * label's children (and pulling the content outside of the parent)
     *
     */
    & > span:first-of-type {
      margin-top: ${checkboxOffset}px;
    }

    /**
     * Override the checkbox label to fill
     * the remaining width of the container
     * for full-width text fields
     */
    & > span:nth-of-type(2) {
      flex: 1;
    }
  }

  /**
   * Override the margin set by the internal ak <FieldWrapper>
   * that is rendered automatically by <Field>
   */
  > div:first-of-type {
    margin-top: 0;
  }

  /**
   * Restore the default textarea cursor
   * behavior that is overriden by the
   * ak checkbox while disabled
   */
  & textarea {
    cursor: auto;
  }
`;

export const EditTaskView = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const DeleteButtonContainer = styled.div`
  margin-right: -${gridSize()}px;
`;

export const TextFieldContainer = styled.div`
  flex: 1;
  margin-right: ${gridSize() / 2}px;
`;

export const ErrorMessageContainer = styled.div`
  margin: 0 ${gridSize() * 3}px ${gridSize()}px ${gridSize() * 3}px;

  /**
   * Add some space between the error message and error icon
   */
  > div:first-of-type {
    > span:first-of-type {
      margin-right: ${gridSize() / 2}px;
    }
  }
`;

export const ErrorMessageList = styled.ul`
  margin-top: 0;
  padding-left: 0;
  list-style: none;
`;
