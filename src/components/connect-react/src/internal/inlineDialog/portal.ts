import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const UniversalPortal: React.FunctionComponent<{ container: Element }> = ({
  children,
  container,
}) => {
  const [isActive, setActive] = useState(false);

  // Activate the portal after the component has mounted, and the effect
  // hook is fired for the first time. This ensures that we do not attempt
  // to render the portal during SSR.
  useEffect(() => setActive(true), []);

  if (isActive && container) {
    return ReactDOM.createPortal(children, container);
  } else {
    return null;
  }
};

export default UniversalPortal;
