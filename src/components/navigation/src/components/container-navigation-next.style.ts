import styled from '@emotion/styled';

// Required to override first group top margin
export const GroupHeadingNoTopMargin = styled.div`
  > *:first-child {
    margin-top: 0;
  }
`;
