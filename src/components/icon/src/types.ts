export type BitkitIconTypes = {
  label: string;
  onClick?: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  size?: IconSizes;
};

export enum IconSizes {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Xlarge = 'xlarge',
}
