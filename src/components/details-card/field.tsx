import React, { ReactNode } from 'react';

import * as styles from './details-card.styled';

type FieldProps = {
  label: string | ReactNode;
  value: string | ReactNode;
  isFocusable?: boolean;
};

const Field = (props: FieldProps) => {
  return (
    <styles.Column>
      <styles.Label>{props.label}</styles.Label>
      {props.isFocusable ? (
        <div>{props.value}</div>
      ) : (
        <styles.Value>{props.value}</styles.Value>
      )}
    </styles.Column>
  );
};

export default Field;
