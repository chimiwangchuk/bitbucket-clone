import React, { useRef, useState, useCallback } from 'react';
import { BrokenImageDiff } from './broken-image-diff';
import * as styles from './image-diff-content.style';

type ImageDiffContentProps = {
  className?: string;
  source: string;
  title: string;
};

type Dimensions = [number | null, number | null];

function ImageDiffContent(props: ImageDiffContentProps) {
  const { className, source, title } = props;
  const imageRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>([null, null]);
  const [hasError, setHasError] = useState<boolean>(false);

  const onLoad = useCallback(() => {
    const el = imageRef.current;
    if (el) {
      setDimensions([el.naturalWidth, el.naturalHeight]);
    }
  }, []);
  const onError = useCallback(() => {
    setHasError(true);
  }, []);
  const hasDimensions = dimensions[0] !== null && dimensions[1] !== null;

  if (hasError) {
    return <BrokenImageDiff />;
  }

  return (
    <div className={className}>
      <styles.ImageWrapper>
        <styles.Title>{title}</styles.Title>
        <styles.Image
          ref={imageRef}
          src={source}
          onLoad={onLoad}
          onError={onError}
        />
      </styles.ImageWrapper>
      {hasDimensions && (
        <div>
          <styles.Dimension>
            <styles.DimensionKey>W:</styles.DimensionKey> {dimensions[0]}
          </styles.Dimension>
          <styles.Dimension>
            <styles.DimensionKey>H:</styles.DimensionKey> {dimensions[1]}
          </styles.Dimension>
        </div>
      )}
    </div>
  );
}

export default React.memo(ImageDiffContent);
