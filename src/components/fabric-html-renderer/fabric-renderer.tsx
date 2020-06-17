import { bitbucketSchema } from '@atlaskit/adf-schema';
import { ReactRenderer } from '@atlaskit/renderer';
import React, { useEffect } from 'react';

import { useIntl } from 'src/hooks/intl';
import { usePortalContainer } from 'src/hooks/use-portal-container';
import { buildProfilecardProvider } from 'src/utils/bb-profilecard-provider';

import { toJson } from './bb-json-transformer';
import { providerFactory } from './bb-provider-factory';
import { htmlTransformer } from './bb-renderer-transformer';

const defaultTransformer = 'html';
const transformerMapping = {
  html: htmlTransformer,
};

type FabricHtmlRendererProps = {
  areProfileCardsEnabled: boolean;
  format: 'html';
  src: string;
};

export const FabricRenderer: React.FC<FabricHtmlRendererProps> = (
  props: FabricHtmlRendererProps
) => {
  const { src, format } = props;
  const intl = useIntl();
  const portal = usePortalContainer();

  useEffect(() => {
    // this intentionally only runs on the initial render, even though `areProfileCardsEnabled` can change
    if (props.areProfileCardsEnabled) {
      providerFactory.setProvider(
        'profilecardProvider',
        buildProfilecardProvider({ intl })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transformer =
    transformerMapping[format] || transformerMapping[defaultTransformer];
  const parsedHtml = transformer.parse(src);
  const document = toJson(parsedHtml);

  return (
    <ReactRenderer
      schema={bitbucketSchema}
      // @ts-ignore our version of renderer requires a different version of editor-common
      dataProviders={providerFactory}
      document={document}
      portal={portal}
    />
  );
};
