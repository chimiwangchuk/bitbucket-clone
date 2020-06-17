import React from 'react';
import { components } from '@atlaskit/select';

import * as styles from './create-branch.style';

type Props = {
  isDisabled: boolean;
};

const CustomSelectOption = (props: Props) => {
  // @ts-ignore TODO: fix missing expected react-select style props
  const option = <components.Option {...props} />;
  return props.isDisabled ? (
    <styles.DisabledOption>{option}</styles.DisabledOption>
  ) : (
    option
  );
};

export default CustomSelectOption;
