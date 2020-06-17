import { Diff } from 'src/types/pull-request';

export function getExcludedPattern(file: Diff): string {
  for (let i = 0; i < file.headers.length; ++i) {
    const excludedHeader = file.headers[i].match(
      /^File excluded by pattern "(.*)"$/
    );
    if (excludedHeader) {
      return excludedHeader[1];
    }
  }

  return '';
}
