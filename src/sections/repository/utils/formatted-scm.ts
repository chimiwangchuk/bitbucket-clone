export function formatScm(scm: 'git' | 'hg') {
  return scm === 'hg' ? 'Mercurial' : 'Git';
}

export function scmCommandCode(
  scm: 'git' | 'hg',
  targetBranchShortHash: string,
  featureBranchShortHash: string,
  path?: string
) {
  return scm === 'git'
    ? `git fetch\ngit diff ${targetBranchShortHash}...${featureBranchShortHash}${
        path ? ` -- ${path}` : ''
      }`
    : `hg pull\nhg diff -r 'ancestor(${targetBranchShortHash}, ${featureBranchShortHash})' -r ${featureBranchShortHash}${
        path ? ` ${path}` : ''
      }`;
}
