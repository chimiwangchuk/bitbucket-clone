import React, { useState, useEffect, createContext, useContext } from 'react';
import FeatureFlagWebClient, {
  AnalyticsClientInterface,
  FeatureFlagUser,
  ClientOptions,
  SupportedFlagTypes,
  GetValueOptions,
} from '@atlassiansox/feature-flag-web-client';
import { FeatureKeyType, FeatureKeys } from './features';

type FeatureConfig = {
  apiKey: string;
  analyticsWebClient?: AnalyticsClientInterface;
  featureFlagUser?: FeatureFlagUser;
  options: ClientOptions;
};

const useClient = ({
  apiKey,
  analyticsWebClient,
  featureFlagUser,
  options,
}: FeatureConfig) => {
  // We wrap the client to give us an immutable object to pass to the
  // context provider. This allows us to create a new object when the client
  // is updated so consumers know that they need to re-render.
  const [clientWrapper, setClientWrapper] = useState<{
    client: FeatureFlagWebClient | null;
  }>({ client: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !clientWrapper.client &&
      !loading &&
      apiKey &&
      analyticsWebClient &&
      featureFlagUser
    ) {
      setLoading(true);
      const newClient = new FeatureFlagWebClient(
        apiKey,
        analyticsWebClient,
        featureFlagUser,
        options
      );
      newClient.ready().then(() => setClientWrapper({ client: newClient }));
    }
  }, [
    apiKey,
    analyticsWebClient,
    featureFlagUser,
    options,
    loading,
    clientWrapper,
  ]);

  const currentClient = clientWrapper?.client;

  useEffect(() => {
    if (currentClient && featureFlagUser) {
      currentClient.updateFeatureFlagUser(featureFlagUser).then(() => {
        setClientWrapper({ client: currentClient });
      });
    }
  }, [featureFlagUser, currentClient]);

  return clientWrapper;
};

export const FeatureContext = createContext<{
  client: FeatureFlagWebClient | null;
}>({ client: null });

export const FeatureProvider: React.FC<FeatureConfig> = ({
  apiKey,
  analyticsWebClient,
  featureFlagUser,
  options,
  children,
}) => {
  const client = useClient({
    apiKey,
    analyticsWebClient,
    featureFlagUser,
    options,
  });

  return (
    <FeatureContext.Provider value={client}>{children}</FeatureContext.Provider>
  );
};

export const useFeature = (
  key: FeatureKeyType,
  defaultValue: SupportedFlagTypes = false,
  options?: GetValueOptions<SupportedFlagTypes>
) => {
  const clientWrapper = useContext(FeatureContext);
  const { client } = clientWrapper;
  const [flagValue, setFlagValue] = useState(defaultValue);

  useEffect(() => {
    if (client) {
      setFlagValue(client.getFlagValue(key, defaultValue, options));
      return client.on(key, defaultValue, setFlagValue, options);
    }
    return () => {};
  }, [client, clientWrapper, defaultValue, key, options]);

  return flagValue;
};

const getFeatureName = (featureKey: FeatureKeyType): keyof typeof FeatureKeys =>
  (Object.keys(FeatureKeys) as (keyof typeof FeatureKeys)[]).filter(
    key => FeatureKeys[key] === featureKey
  )[0];

export type FeatureProp = {
  [name in keyof typeof FeatureKeys]: SupportedFlagTypes;
};

function isPropWithFeatures<T>(
  props: object
): props is T & { features: FeatureProp } {
  return !!(props as any).features;
}

export const withFeature = (
  key: FeatureKeyType,
  defaultValue: SupportedFlagTypes,
  options?: GetValueOptions<SupportedFlagTypes>
) => <T extends {}>(
  WrappedComponent: React.ComponentType<T>
): React.FC<Omit<T, 'features'>> => {
  return (props: T) => {
    const name: keyof typeof FeatureKeys = getFeatureName(key);
    const flagValue = useFeature(key, defaultValue, options);
    let featureProp = { [name]: flagValue };

    if (isPropWithFeatures(props)) {
      featureProp = { ...props.features, ...featureProp };
    }

    return <WrappedComponent {...props} features={featureProp} />;
  };
};

export * from './features';
export {
  EnvironmentType,
  FeatureFlagUserWithIdentifier,
  AnonymousFlagUser,
  FeatureFlagUser,
  Identifiers,
} from '@atlassiansox/feature-flag-web-client';
