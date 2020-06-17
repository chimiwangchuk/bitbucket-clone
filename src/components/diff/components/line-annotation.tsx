import React from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import {
  LineAnnotation as LineAnnotationType,
  LineAnnotationSeverity,
  LineAnnotationResult,
} from '../types';
import messages from '../i18n';
import resultPassedIconUrl from './assets/annotation-result-passed-icon.svg';
import resultFailedIconUrl from './assets/annotation-result-failed-icon.svg';
import resultSkippedIconUrl from './assets/annotation-result-skipped-icon.svg';
import resultIgnoredIconUrl from './assets/annotation-result-ignored-icon.svg';
import severityCriticalIconUrl from './assets/annotation-severity-critical-icon.svg';
import severityHighIconUrl from './assets/annotation-severity-high-icon.svg';
import severityMediumIconUrl from './assets/annotation-severity-medium-icon.svg';
import severityLowIconUrl from './assets/annotation-severity-low-icon.svg';

export const AnnotationResultIcon = injectIntl(
  ({ result, intl }: { result?: LineAnnotationResult; intl: InjectedIntl }) => {
    switch (result) {
      case LineAnnotationResult.Passed:
        return (
          <img
            alt={intl.formatMessage(messages.resultPassedIcon)}
            src={resultPassedIconUrl}
          />
        );
      case LineAnnotationResult.Failed:
        return (
          <img
            alt={intl.formatMessage(messages.resultFailedIcon)}
            src={resultFailedIconUrl}
          />
        );
      case LineAnnotationResult.Skipped:
        return (
          <img
            alt={intl.formatMessage(messages.resultSkippedIcon)}
            src={resultSkippedIconUrl}
          />
        );
      case LineAnnotationResult.Ignored:
        return (
          <img
            alt={intl.formatMessage(messages.resultIgnoredIcon)}
            src={resultIgnoredIconUrl}
          />
        );
      default:
        return null;
    }
  }
);

export const AnnotationSeverityIcon = injectIntl(
  ({
    severity,
    intl,
  }: {
    severity?: LineAnnotationSeverity;
    intl: InjectedIntl;
  }) => {
    switch (severity) {
      case LineAnnotationSeverity.Critical:
        return (
          <img
            alt={intl.formatMessage(messages.severityCriticalIcon)}
            src={severityCriticalIconUrl}
          />
        );
      case LineAnnotationSeverity.High:
        return (
          <img
            alt={intl.formatMessage(messages.severityHighIcon)}
            src={severityHighIconUrl}
          />
        );
      case LineAnnotationSeverity.Medium:
        return (
          <img
            alt={intl.formatMessage(messages.severityMediumIcon)}
            src={severityMediumIconUrl}
          />
        );
      case LineAnnotationSeverity.Low:
        return (
          <img
            alt={intl.formatMessage(messages.severityLowIcon)}
            src={severityLowIconUrl}
          />
        );
      default:
        return null;
    }
  }
);

type Props = { intl: InjectedIntl; lineAnnotations: LineAnnotationType[] };

const LineAnnotation: React.FC<Props> = ({ intl, lineAnnotations }) => {
  return (
    <>
      {lineAnnotations.map(annotation => (
        <div
          key={`annotation_${annotation.uuid}`}
          className="line-report-outer inline-content-wrapper gutter-width-apply-negative-left-margin gutter-width-apply-max-width-calc gutter-width-apply-left"
        >
          <div className="line-numbers gutter-width-apply-width gutter-width-apply-flex" />
          <div className="inline-content gutter-width-apply-left">
            <div className="bitkit-diff-inline-content-container bitkit-diff-inline-annotation-container">
              {annotation.severity ? (
                <>
                  <div className="bitkit-diff-inline-annotation-icon">
                    <AnnotationSeverityIcon severity={annotation.severity} />
                  </div>
                  <div className="bitkit-diff-inline-annotation-status">
                    {annotation.severity.toLowerCase()} :
                  </div>
                </>
              ) : annotation.result ? (
                <>
                  <div className="bitkit-diff-inline-annotation-icon">
                    <AnnotationResultIcon result={annotation.result} />
                  </div>
                  <div className="bitkit-diff-inline-annotation-status">
                    {annotation.result.toLowerCase()} :
                  </div>
                </>
              ) : null}

              <div className="bitkit-diff-inline-annotation-summary">
                {annotation.summary}
              </div>
              {annotation.link && (
                <a
                  href={annotation.link}
                  className="bitkit-diff-inline-annotation-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {intl.formatMessage(messages.viewReport)}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default React.memo(injectIntl(LineAnnotation));
