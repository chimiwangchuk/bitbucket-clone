import React from 'react';
import * as Sentry from '@sentry/browser';
import { useFeature, FeatureKeys } from '@atlassian/bitbucket-features';

// TODO: delete everything here after A/A test
/* This component tests the Fx3 client to make sure we're tracking */
const AATest = () => {
  useFeature(FeatureKeys.isAAEnabled, false, {
    shouldSendExposureEvent: true,
  });
  return null;
};

export class AATestWithErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }
  render() {
    return <AATest />;
  }
}
