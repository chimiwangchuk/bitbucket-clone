import styled from '@emotion/styled';
import { gridSize, layers, colors } from '@atlaskit/theme';

/* The @atlaskit/inline-dialog applies its own padding around the content that
Frontbucket supplies. This would normally be fine, but this element has an
"onMouseLeave" handler applied which gets fired too early if the spacing comes
from the parent component. The padding value is not exported by AkInlineDialog */
const inlineDialogPadding = gridSize() * 2;
export const InlineDialogWrapper = styled.div`
  margin: -${inlineDialogPadding}px;
  padding: ${inlineDialogPadding}px;
`;

/* 
15 chosen because 20 would cause panel to appear below file header panel and 10 causes 
panel to appear above sticky header.
*/
const heightOffset = 15;

/*
z-index for the subheading dialog should be less than navigation subheading (appear below)
while appearing above the file headers in the diff (greater z-index) while shown in main PR panel above
diff.
*/
export const Container = styled.span<{
  shownInStickyHeader?: boolean;
}>`
  display: flex;
  align-items: center;
  font-weight: normal;
  margin-left: ${gridSize() / 2}px;
  margin-right: ${gridSize() / 2}px;
  ${({ shownInStickyHeader }) =>
    shownInStickyHeader
      ? `
          height: 50%;
          margin-top: ${gridSize()}px;
          border-left: 1px solid ${colors.N30};
          padding-left: ${gridSize()}px;
          z-index: initial;
        `
      : `
          z-index: ${layers.navigation() - heightOffset};
        `}
`;

export const DialogParagraph = styled.p`
  margin-bottom: ${gridSize()}px;
`;

export const InlineContainer = styled.span`
  margin-left: ${gridSize() / 2}px;
`;
