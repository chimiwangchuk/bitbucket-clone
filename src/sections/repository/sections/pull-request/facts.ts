import Fact from '@atlassian/bitkit-analytics';

export type PullRequestFactPropertiesSchema = {
  to_repository_uuid: string;
  to_repository_owner_uuid: string | null | undefined;
  from_repository_uuid?: string;
  pull_request_id: number | string | null;
  history_id?: string;
};

export class PullRequestFact extends Fact<PullRequestFactPropertiesSchema> {
  constructor(
    name: string,
    factProperties: PullRequestFactPropertiesSchema | null | undefined
  ) {
    super({
      ...factProperties,
      // @ts-ignore
      frontbucket_view: true,
    });

    this.name = name;
  }
}
