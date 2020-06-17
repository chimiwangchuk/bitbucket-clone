import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
// eslint-disable-next-line @typescript-eslint/camelcase
import add_milliseconds from 'date-fns/add_milliseconds';
import format from 'date-fns/format';
import ModalDialog, {
  ModalHeader,
  ModalTitle,
  HeaderComponentProps,
} from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import { RelativeDate } from '@atlassian/bitkit-date';
import { LineAnnotation } from '@atlassian/bitkit-diff/types';
import { fetchCodeInsightsAnnotations } from 'src/redux/pull-request/actions';
import { useIntl } from 'src/hooks/intl';
import {
  CodeInsightsResult,
  CodeInsightsResultType,
} from 'src/types/code-insights';
import Loading from 'src/components/loading';
import {
  getCurrentCodeInsightsAnnotations,
  getCurrentCodeInsightsAnnotationsLoadingState,
  getCodeInsightsAnnotationUrl,
} from 'src/redux/pull-request/selectors';
import {
  publishScreenEvent,
  publishUiEvent,
} from 'src/utils/analytics/publish';
import messages from './code-insights.i18n';
import CodeInsightsCardItem from './code-insights-card-item';
import CodeInsightsAnnotationItem from './code-insights-annotation-item';
import CodeInsightsReportLocked from './code-insights-report-locked';
import {
  ModalWrapper,
  ModalSidebar,
  ModalContent,
  ReporterInfo,
  ReporterLogo,
  ReporterTitle,
  ReporterDate,
  ReporterDetails,
  ReporterMetadataWrapper,
  ReporterMetadataItem,
  HeadResultCell,
  HeadSeverityCell,
  HeadSummaryCell,
  HeadPathCell,
  HeadExpanderCell,
  HeadLinkCell,
  PendingState,
} from './code-insights.style';

type Props = {
  codeInsightsReports: CodeInsightsResult[];
  selectedReportIndex: number;
  setSelectedReport: (selectedReport: number) => void;
  closeDialog: () => void;
};

type AnnotationsTableProps = {
  annotations: LineAnnotation[];
  closeDialog: () => void;
};

const Header: FC<HeaderComponentProps> = ({ onClose }) => {
  const intl = useIntl();
  return (
    <ModalHeader>
      <ModalTitle>{intl.formatMessage(messages.label)}</ModalTitle>
      <Button onClick={onClose} appearance="subtle-link" spacing="none">
        <CrossIcon label={intl.formatMessage(messages.modalClose)} />
      </Button>
    </ModalHeader>
  );
};

const AnnotationsTable: React.FC<AnnotationsTableProps> = ({
  annotations,
  closeDialog,
}) => {
  const intl = useIntl();
  const getSourceUrl = useSelector(getCodeInsightsAnnotationUrl);

  const totalIssues = annotations.length;
  if (totalIssues === 0) {
    return null;
  }

  const hasDetails = annotations.some(a => !!a?.details);
  const hasPath = annotations.some(a => !!a.path);
  const hasResult = annotations.some(a => !!a.result);
  const hasSeverity = annotations.some(a => !!a.severity);

  return (
    <table>
      <thead>
        <tr>
          {hasDetails && <HeadExpanderCell />}
          {hasResult && (
            <HeadResultCell>
              {intl.formatMessage(messages.resultHeader)}
            </HeadResultCell>
          )}
          {hasSeverity && (
            <HeadSeverityCell>
              {intl.formatMessage(messages.severityHeader)}
            </HeadSeverityCell>
          )}
          <HeadSummaryCell>
            {intl.formatMessage(messages.summaryHeader)}
          </HeadSummaryCell>
          {hasPath && (
            <HeadPathCell>
              {intl.formatMessage(messages.fileHeader)}
            </HeadPathCell>
          )}
          <HeadLinkCell />
        </tr>
      </thead>
      <tbody>
        {annotations.map(annotation => (
          <CodeInsightsAnnotationItem
            codeInsightsAnnotation={annotation}
            hasDetails={hasDetails}
            hasPath={hasPath}
            hasResult={hasResult}
            hasSeverity={hasSeverity}
            closeDialog={closeDialog}
            getSourceUrl={getSourceUrl}
            key={`code-insights-annotation-item-${annotation.uuid}`}
          />
        ))}
      </tbody>
    </table>
  );
};

type FormattedMetadataProps = {
  data: {
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
  };
};

export const FormattedMetadata: React.FC<FormattedMetadataProps> = ({
  data,
}) => {
  const intl = useIntl();
  if (data.type === 'BOOLEAN') {
    return (
      <strong>
        {intl.formatMessage(
          data.value
            ? messages.reportMetadataTrue
            : messages.reportMetadataFalse
        )}
      </strong>
    );
  } else if (data.type === 'DATE') {
    return (
      <strong>
        <RelativeDate date={data.value} />
      </strong>
    );
  } else if (data.type === 'LINK' && data.value.text && data.value.href) {
    return (
      <a href={data.value.href} target="_blank" rel="nofollow">
        <strong>{data.value.text}</strong>
      </a>
    );
  } else if (data.type === 'DURATION') {
    return (
      <strong>
        {format(add_milliseconds(new Date(0), data.value), 'm[m] s[s]')}
      </strong>
    );
  } else if (data.type === 'PERCENTAGE') {
    return <strong>{data.value}%</strong>;
  }
  return <strong>{String(data.value)}</strong>;
};

const CodeInsightsModal: React.FC<Props> = ({
  codeInsightsReports,
  selectedReportIndex,
  setSelectedReport,
  closeDialog,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const selectedReport = codeInsightsReports[selectedReportIndex];

  const codeInsightsAnnotations =
    useSelector(getCurrentCodeInsightsAnnotations)[selectedReport.uuid] || [];
  const isLoading = useSelector(getCurrentCodeInsightsAnnotationsLoadingState);

  useEffect(() => {
    publishScreenEvent('codeInsightsModal');
  }, []);

  useEffect(() => {
    if (!codeInsightsAnnotations.length) {
      dispatch(fetchCodeInsightsAnnotations(selectedReport.uuid));
    }
  }, [dispatch, codeInsightsAnnotations.length, selectedReport.uuid]);

  return (
    <ModalDialog
      onClose={closeDialog}
      components={{ Header }}
      width="x-large"
      height="80vh"
    >
      <ModalWrapper>
        <ModalSidebar>
          {codeInsightsReports.map((report, i) => (
            <CodeInsightsCardItem
              key={`code-insights-modal-item-${i}`}
              codeInsightsReport={report}
              openDialogWithSelectedReport={() => {
                setSelectedReport(i);
                publishUiEvent({
                  action: 'clicked',
                  actionSubject: 'button',
                  source: 'codeInsightsModal',
                  actionSubjectId: 'selectReportButton',
                });
              }}
              isActive={selectedReportIndex === i}
              isModalView
            />
          ))}
        </ModalSidebar>
        <ModalContent>
          <ReporterInfo>
            <ReporterLogo>
              {selectedReport.logo_url ? (
                <img
                  src={selectedReport.logo_url}
                  alt={selectedReport.reporter}
                  role="presentation"
                />
              ) : (
                <DashboardIcon label={selectedReport.reporter} />
              )}
            </ReporterLogo>
            <ReporterTitle>
              {selectedReport.link ? (
                <Button
                  spacing="none"
                  appearance="link"
                  href={selectedReport.link}
                  target="_blank"
                  rel="nofollow"
                  onClick={() => {
                    closeDialog();
                    publishUiEvent({
                      action: 'clicked',
                      actionSubject: 'button',
                      source: 'codeInsightsModal',
                      actionSubjectId: 'reporterLink',
                    });
                  }}
                >
                  {selectedReport.title}
                </Button>
              ) : (
                selectedReport.title
              )}
            </ReporterTitle>
            <ReporterDate>
              <FormattedMessage
                {...messages.reporterMeta}
                values={{
                  reporter: selectedReport.reporter,
                  date: selectedReport.updated_on ? (
                    <RelativeDate date={selectedReport.updated_on} />
                  ) : (
                    ''
                  ),
                }}
              />
            </ReporterDate>
            {!selectedReport.is_locked && (
              <ReporterDetails>{selectedReport.details}</ReporterDetails>
            )}
          </ReporterInfo>
          {!selectedReport.is_locked && (
            <ReporterMetadataWrapper>
              {selectedReport.data &&
                selectedReport.data.map((data, key) => (
                  <ReporterMetadataItem
                    key={`code-insights-reporter-metadata-item-${key}`}
                  >
                    <dt>{data.title}</dt>
                    <dd>
                      <FormattedMetadata data={data} />
                    </dd>
                  </ReporterMetadataItem>
                ))}
            </ReporterMetadataWrapper>
          )}
          {selectedReport.is_locked ? (
            <CodeInsightsReportLocked />
          ) : isLoading ? (
            <Loading size="large" />
          ) : codeInsightsAnnotations.length === 0 &&
            selectedReport.result === CodeInsightsResultType.Pending ? (
            <PendingState>
              {intl.formatMessage(messages.pendingReportMessage)}
            </PendingState>
          ) : (
            <AnnotationsTable
              annotations={codeInsightsAnnotations}
              closeDialog={closeDialog}
            />
          )}
        </ModalContent>
      </ModalWrapper>
    </ModalDialog>
  );
};

export default CodeInsightsModal;
