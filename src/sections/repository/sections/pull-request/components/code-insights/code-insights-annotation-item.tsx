import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import {
  AnnotationSeverityIcon,
  AnnotationResultIcon,
} from '@atlassian/bitkit-diff';
import { LineAnnotation } from '@atlassian/bitkit-diff/types';

import { useIntl } from 'src/hooks/intl';
import { publishUiEvent } from 'src/utils/analytics/publish';
import messages from './code-insights.i18n';
import {
  SeverityInfo,
  AnnotationExpander,
  AnnotationRow,
  DetailsCell,
  DetailsWrapper,
  ExternalLink,
  BodyExpanderCell,
  BodyResultCell,
  BodySeverityCell,
  BodyCell,
  BodyPathCell,
  BodyLinkCell,
  ResultWrapper,
  ResultIconWrapper,
  ResultText,
  AnnotationSummary,
} from './code-insights.style';

const SUMMARY_LENGTH_WITHOUT_TOOLTIP = 30;

type Props = {
  closeDialog: () => void;
  getSourceUrl: (path: string) => string;
  codeInsightsAnnotation: LineAnnotation;
  hasDetails: boolean;
  hasPath: boolean;
  hasResult: boolean;
  hasSeverity: boolean;
};

const CodeInsightsAnnotationItem: React.FC<Props> = ({
  closeDialog,
  codeInsightsAnnotation,
  getSourceUrl,
  hasDetails,
  hasPath,
  hasResult,
  hasSeverity,
}) => {
  const intl = useIntl();
  const {
    link,
    path,
    line,
    severity,
    result,
    summary,
    details,
  } = codeInsightsAnnotation;

  const [isExpanded, setExpanded] = useState(false);
  const numberOfColumns =
    1 +
    (hasDetails ? 1 : 0) +
    (hasPath ? 1 : 0) +
    (hasSeverity ? 1 : 0) +
    (hasResult ? 1 : 0);

  return (
    <>
      <AnnotationRow>
        {hasDetails && (
          <BodyExpanderCell>
            {details && (
              <AnnotationExpander isExpanded={isExpanded}>
                <Button
                  onClick={() => setExpanded(!isExpanded)}
                  appearance="subtle-link"
                  spacing="none"
                  iconBefore={
                    <ChevronRightIcon
                      size="small"
                      label={intl.formatMessage(
                        isExpanded ? messages.collapse : messages.expand
                      )}
                    />
                  }
                />
              </AnnotationExpander>
            )}
          </BodyExpanderCell>
        )}
        {hasResult && (
          <BodyResultCell>
            {result && (
              <ResultWrapper>
                <ResultIconWrapper>
                  <AnnotationResultIcon result={result} />
                </ResultIconWrapper>
                <ResultText>
                  {intl.formatMessage(
                    // @ts-ignore TODO: fix noImplicitAny error here
                    messages[
                      {
                        PASSED: 'annotationResultPassed',
                        FAILED: 'annotationResultFailed',
                        SKIPPED: 'annotationResultSkipped',
                        IGNORED: 'annotationResultIgnored',
                      }[result]
                    ]
                  )}
                </ResultText>
              </ResultWrapper>
            )}
          </BodyResultCell>
        )}
        {hasSeverity && (
          <BodySeverityCell>
            {severity && (
              <SeverityInfo>
                <AnnotationSeverityIcon
                  severity={codeInsightsAnnotation.severity}
                />
                {intl.formatMessage(
                  // @ts-ignore TODO: fix noImplicitAny error here
                  messages[
                    {
                      LOW: 'annotationSeverityLow',
                      MEDIUM: 'annotationSeverityMedium',
                      HIGH: 'annotationSeverityHigh',
                      CRITICAL: 'annotationSeverityCritical',
                    }[severity]
                  ]
                )}
              </SeverityInfo>
            )}
          </BodySeverityCell>
        )}
        <BodyCell>
          {summary?.length > SUMMARY_LENGTH_WITHOUT_TOOLTIP ? (
            <Tooltip content={summary} position="mouse">
              <AnnotationSummary>{summary}</AnnotationSummary>
            </Tooltip>
          ) : (
            <AnnotationSummary>{summary}</AnnotationSummary>
          )}
        </BodyCell>
        {hasPath && (
          <BodyPathCell>
            {path && (
              <Button
                spacing="none"
                appearance="link"
                href={`${getSourceUrl(path)}${line ? `#lines-${line}` : ''}`}
                target="_blank"
                rel="nofollow"
                onClick={() => {
                  closeDialog();
                  publishUiEvent({
                    action: 'clicked',
                    actionSubject: 'button',
                    source: 'codeInsightsModal',
                    actionSubjectId: 'codeInsightsFileLink',
                    attributes: { severity },
                  });
                }}
              >
                {path}
                {line ? `:${line}` : null}
              </Button>
            )}
          </BodyPathCell>
        )}
        <BodyLinkCell>
          {link && (
            <ExternalLink>
              <Tooltip content={intl.formatMessage(messages.externalLink)}>
                <Button
                  appearance="link"
                  href={link}
                  iconBefore={
                    <ShortcutIcon
                      label={intl.formatMessage(messages.externalLink)}
                      size="small"
                    />
                  }
                  spacing="none"
                  target="_blank"
                  rel="nofollow"
                />
              </Tooltip>
            </ExternalLink>
          )}
        </BodyLinkCell>
      </AnnotationRow>
      {details && (
        <tr>
          <DetailsCell />
          <DetailsCell colSpan={numberOfColumns}>
            <AnimateHeight
              duration={200}
              easing="linear"
              height={!isExpanded ? 0 : 'auto'}
            >
              <DetailsWrapper>{details && <p>{details}</p>}</DetailsWrapper>
            </AnimateHeight>
          </DetailsCell>
        </tr>
      )}
    </>
  );
};

export default CodeInsightsAnnotationItem;
