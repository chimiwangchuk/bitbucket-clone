import React from 'react';

import { SpotlightTarget } from '@atlaskit/onboarding';

type Props = {
  name: string;
  children: any;
};

export default function WelcomeTourTarget({ name, children }: Props) {
  return (
    <SpotlightTarget name={name}>
      <div id={name}>{children}</div>
    </SpotlightTarget>
  );
}
