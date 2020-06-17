import { memoize } from 'lodash-es';
import { LineAnnotation } from '../types';

const getLineAnnotations = memoize(
  (fileAnnotations: LineAnnotation[] | undefined, line: number | undefined) =>
    fileAnnotations && fileAnnotations.length
      ? fileAnnotations.filter(annotation => annotation.line === line)
      : [],
  (fileAnnotations: LineAnnotation[] | undefined, line: number | undefined) =>
    JSON.stringify([
      fileAnnotations ? fileAnnotations.map(a => a?.uuid) : [],
      line,
    ])
);

export default getLineAnnotations;
