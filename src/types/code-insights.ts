export enum CodeInsightsResultType {
  Passed = 'PASSED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Unknown = 'UNKNOWN',
}
export enum CodeInsightsReportType {
  Security = 'SECURITY',
  Coverage = 'COVERAGE',
  Test = 'TEST',
  Bug = 'BUG',
}
export type CodeInsightsResult = {
  uuid: string;
  report_type?: CodeInsightsReportType;
  type: string;
  title: string;
  details: string;
  result?: CodeInsightsResultType;
  reporter: string;
  link?: string;
  external_id: string;
  logo_url?: string;
  data?: Array<{
    title: string;
    type:
      | 'BOOLEAN'
      | 'DATE'
      | 'DURATION'
      | 'LINK'
      | 'NUMBER'
      | 'PERCENTAGE'
      | 'TEXT';
    value: any;
  }>;
  created_on: string;
  updated_on: string;
  is_locked: boolean;
};
