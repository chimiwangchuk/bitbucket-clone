import styled from '@emotion/styled';

// This component is needed to wrap AkFlag so we can:
// 1) disable unwanted text underline on AkButton used in the actions prop (tried creating a
// styled component that directly wrapped AkButton without any luck)
// 2) removes the small "middot" between the two actions on the flag
// Note: generally hacks like this are a bad idea, but we have received design approval
// for this and we have tests to check for the button element so we can have some confidence
// that this hack is still working in the future.
export const FlagWrapper = styled.div`
  button {
    text-decoration: none !important;
  }

  div::before {
    content: '';
  }
`;
