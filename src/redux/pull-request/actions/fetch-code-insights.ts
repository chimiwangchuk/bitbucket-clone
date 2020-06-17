import {
  FETCH_CODE_INSIGHTS_REPORTS,
  FETCH_CODE_INSIGHTS_ANNOTATIONS,
  FETCH_IS_PIPELINES_ENABLED,
} from './constants';

export const fetchCodeInsightsAnnotations = (reportId: string) => ({
  type: FETCH_CODE_INSIGHTS_ANNOTATIONS.REQUEST,
  payload: reportId,
});

export const fetchIsPipelinesEnabled = () => ({
  type: FETCH_IS_PIPELINES_ENABLED.REQUEST,
});

export default () => ({
  type: FETCH_CODE_INSIGHTS_REPORTS.REQUEST,
});
