import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Spinner from '@atlaskit/spinner';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import MediaServicesAnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import { Expander } from 'src/components/sidebar';
import { Card } from 'src/components/details-card';
import { Annotator, Annotation } from '../types';
import * as styles from './annotations-card.style';
import messages from './annotations-card.i18n';

type AnnotationsCardProps = {
  annotators: Annotator[];
  annotations: Annotation[];
  isAnnotationsFeatureEnabled: boolean;
  isLoadingAnnotations: boolean;
  intl: InjectedIntl;
};

class AnnotationsCard extends PureComponent<AnnotationsCardProps> {
  static defaultProps = {
    isCollapsed: false,
    annotations: [],
    annotators: [],
    isAnnotationsFeatureEnabled: false,
    isLoadingAnnotations: true,
  };

  renderAnnotationCounts = () => {
    const { annotations, intl } = this.props;

    // @ts-ignore TODO: fix noImplicitAny error here
    const countStyle = style =>
      annotations.filter(x => x.style === style).length;

    const annotationCounts = {
      info: countStyle('info'),
      warning: countStyle('warning'),
      error: countStyle('error'),
    };

    return (
      annotationCounts && (
        <styles.AnnotationCounts>
          {[
            ...(annotationCounts.error
              ? [
                  intl.formatMessage(messages.errorCount, {
                    count: annotationCounts.error,
                  }),
                ]
              : []),
            ...(annotationCounts.warning
              ? [
                  intl.formatMessage(messages.warningCount, {
                    count: annotationCounts.warning,
                  }),
                ]
              : []),
            ...(annotationCounts.info
              ? [
                  intl.formatMessage(messages.infoCount, {
                    count: annotationCounts.info,
                  }),
                ]
              : []),
          ].join(', ')}
        </styles.AnnotationCounts>
      )
    );
  };

  render() {
    const {
      isAnnotationsFeatureEnabled,
      annotators,
      isLoadingAnnotations,
      intl,
    } = this.props;

    if (!isAnnotationsFeatureEnabled || !annotators || !annotators.length) {
      return null;
    }

    return (
      <Card>
        <Expander
          icon={<MediaServicesAnnotateIcon label="" />}
          label={intl.formatMessage(messages.annotationsLabel)}
        >
          {annotators.map(annotator => (
            <styles.Annotator key={annotator.id}>
              {isLoadingAnnotations ? (
                <Spinner size="small" />
              ) : (
                <CheckCircleIcon size="medium" label="" />
              )}
              <styles.AnnotatorLabel>
                {annotator.descriptor.name.value} (
                {annotator.descriptor.conditions &&
                annotator.descriptor.conditions.length
                  ? intl.formatMessage(messages.fileCountLabel, {
                      count:
                        annotator.descriptor.conditions[0].params.extension,
                    })
                  : intl.formatMessage(messages.allFilesLabel)}
                ){this.renderAnnotationCounts()}
              </styles.AnnotatorLabel>
            </styles.Annotator>
          ))}
        </Expander>
      </Card>
    );
  }
}

export default injectIntl(AnnotationsCard);
