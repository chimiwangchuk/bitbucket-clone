import React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from '@atlaskit/theme';
import {
  FileAddedIcon,
  FileRenamedIcon,
  FileRemovedIcon,
  FileModifiedIcon,
  IconSizes,
  BitkitIconTypes,
} from '@atlassian/bitkit-icon';
import { DiffStatStatus } from 'src/types/diffstat';
import { useIntl } from 'src/hooks/intl';
import messages from './diff-file-status.i18n';

const removedFileTypeBackgroundColor = colors.R300;

type IconProps = {
  icon: (props: BitkitIconTypes) => JSX.Element;
  message: FormattedMessage.MessageDescriptor;
  secondaryColor?: string;
};

// Defines the most common diffstat statuses.
// Statuses that aren't in this are treated the
// same as `DiffStatStatus.Modified`
type MappedDiffStatStatuses =
  | DiffStatStatus.Added
  | DiffStatStatus.Removed
  | DiffStatStatus.Modified
  | DiffStatStatus.TypeChanged
  | DiffStatStatus.Renamed
  | DiffStatStatus.BinaryConflict;

type StatusMapping = { [key in MappedDiffStatStatuses]: IconProps };

const StatusMappings: StatusMapping = {
  [DiffStatStatus.Added]: {
    icon: FileAddedIcon,
    message: messages.addedFileType,
    secondaryColor: undefined,
  },
  [DiffStatStatus.Removed]: {
    icon: FileRemovedIcon,
    message: messages.removedFileType,
    secondaryColor: removedFileTypeBackgroundColor,
  },
  [DiffStatStatus.Modified]: {
    icon: FileModifiedIcon,
    message: messages.modifiedFileType,
  },
  [DiffStatStatus.TypeChanged]: {
    icon: FileModifiedIcon,
    message: messages.typeChangedFileType,
  },
  [DiffStatStatus.Renamed]: {
    icon: FileRenamedIcon,
    message: messages.renamedFileType,
  },
  [DiffStatStatus.BinaryConflict]: {
    icon: FileModifiedIcon,
    message: messages.modifiedFileType,
  },
};

type Props = {
  fileDiffStatus?: DiffStatStatus;
  size?: IconSizes;
};

export const DiffStatusIcon = ({
  fileDiffStatus = DiffStatStatus.Modified,
  size = IconSizes.Small,
}: Props) => {
  const intl = useIntl();

  const { icon: Icon, message, secondaryColor } =
    StatusMappings[fileDiffStatus as MappedDiffStatStatuses] ||
    StatusMappings.modified;

  return (
    <Icon
      label={intl.formatMessage(message)}
      size={size}
      secondaryColor={secondaryColor}
    />
  );
};
