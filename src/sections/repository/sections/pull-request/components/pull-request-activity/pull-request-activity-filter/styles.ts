import { gridSize, layers } from '@atlaskit/theme';
import { StylesConfig } from '@atlaskit/select';
import { subtleSelector } from 'src/sections/repository/styles/filters';

export const styles: StylesConfig = {
  singleValue: () => ({
    paddingLeft: `${gridSize() * 0.5}px`,
  }),
  placeholder: () => ({
    paddingLeft: `${gridSize() * 0.5}px`,
    position: 'inherit',
    transform: 'inherit',
  }),
  // @ts-ignore TODO: fix noImplicitAny error here
  control: (css, state) => ({
    ...css,
    ...subtleSelector(css, state),
  }),
  // @ts-ignore TODO: fix noImplicitAny error here
  menu: css => ({
    ...css,
    zIndex: layers.modal(),
  }),
};
