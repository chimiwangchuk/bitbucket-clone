import Fact from '@atlassian/bitkit-analytics';

export type ConnectFactProps = {
  principal_id: string;
  app_key: string;
  module_key: string;
  module_type: string;
  location?: string;
  description?: string;
};

export function createConnectFact(
  eventName: string,
  eventData: ConnectFactProps
): Fact<ConnectFactProps> {
  const fact = new Fact(eventData);
  fact.name = eventName;
  return fact;
}
