import styled from '@emotion/styled';
import { gridSize, typography } from '@atlaskit/theme';

// Ak Page widths copied from @atlaskit/page because they can't be imported
const defaultGridColumnWidth = gridSize() * 10; // 80
const fixedGridPageWidth = `${defaultGridColumnWidth * 12}px`; // 960

// because PageHeader is no longer inside Grid we need to
// apply the same margin/padding as it does to be consistent
export const PageHeaderWrapper = styled.header<{
  layout?: string;
  'data-qa'?: string;
}>`
  margin: 0 auto;
  max-width: ${props =>
    props.layout === 'fluid' ? '100%' : fixedGridPageWidth};
  padding: 0 ${gridSize() * 2.5}px;
`;

export const PageHeaderColumn = styled.div`
  margin: 0 ${gridSize() * 2.5}px;
`;

export const PageSection = styled.section`
  margin: 0 auto;
  max-width: ${fixedGridPageWidth};
`;

// This is the default styling applied to @atlaskit/panel headings
export const PanelHeader = styled.span`
  ${typography.h400() as any};
  margin: 0;
  display: flex;
  align-items: center;
`;
