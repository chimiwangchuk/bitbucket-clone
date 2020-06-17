import React, { useCallback } from 'react';

type OwnProps = {
  number?: number;
  label?: string;
  permalink: string;
  onPermalinkClick?: (permalink: string) => void;
};

export const LineLink: React.FC<OwnProps> = ({
  number,
  label,
  permalink,
  onPermalinkClick,
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (onPermalinkClick) {
        event.preventDefault();
        onPermalinkClick(permalink);
      }
    },
    [permalink, onPermalinkClick]
  );

  return number ? (
    <a
      href={permalink ? `#${permalink}` : undefined}
      onClick={handleClick}
      aria-label={label}
      className="line-number-permalink"
    >
      {number}
    </a>
  ) : (
    <div className="line-number" />
  );
};
