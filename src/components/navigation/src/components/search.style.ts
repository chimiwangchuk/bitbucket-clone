import styled from '@emotion/styled';

// Use && to make the specificity of this selector higher to override
// styles for inputs defined globally in forms.less (until entire site
// can be refactored to use styled-components).
// TODO: !IMPORTANT - clean up CSS override
export const StyledSearchContainer = styled.div`
  && input {
    border: 0;
    box-sizing: inherit;
    font-family: inherit;
    font-size: 1.4em;
    line-height: inherit;
    height: inherit;
    border-radius: inherit;
    padding: inherit;
  }
`;

export const SearchContext = styled.span`
  font-weight: bold;
`;
