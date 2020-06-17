import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import RepositoryLink from 'src/components/repository-link';

export const BreadcrumbsItemRepositoryLink = styled(RepositoryLink)`
  color: ${colors.N200};

  &:hover,
  &:focus {
    color: ${colors.N90};
  }
`;
