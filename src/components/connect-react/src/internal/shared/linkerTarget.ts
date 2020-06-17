export interface LinkerTargetProps {
  principalId?: string;
  appKey?: string;
  moduleKey?: string;
  linkKey?: string;
  text?: string;
  principalType?: 'user' | 'team';
}

export const linkerTargetSelfLink = ({
  principalId,
  appKey,
  linkKey,
  text,
}: LinkerTargetProps) =>
  `internal_linker_match:${principalId}:${appKey}:${linkKey}:${text}`;

export const linkerTarget = ({
  principalId = '',
  principalType,
  appKey = '',
  moduleKey = '',
  linkKey = '',
  text = '',
}: LinkerTargetProps) => ({
  type: 'internal_linker_match',
  text,
  context: {
    account: principalType && {
      type: principalType,
      uuid: principalId,
    },
    principal_uuid: principalId,
    key: appKey,
  },
  module: {
    descriptor: {
      key: linkKey,
    },
  },
  links: {
    self: {
      href: linkerTargetSelfLink({
        principalId,
        appKey,
        moduleKey,
        linkKey,
        text,
      }),
    },
  },
});
