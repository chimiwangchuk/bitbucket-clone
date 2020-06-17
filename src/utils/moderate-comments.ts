// @ts-ignore TODO: fix noImplicitAny error here
export const canModerateComments = userAccessLevel =>
  ['admin'].includes(userAccessLevel);
