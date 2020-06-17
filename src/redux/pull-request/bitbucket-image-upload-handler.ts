import { Thunk, BucketDispatch } from 'src/types/state';
import { chooseImage, uploadImage } from './image-upload-reducer';

export const ACCEPTED_TYPES = ['image/jpeg', 'image/gif', 'image/png'];
export const ACCEPTED_IMAGES_ATTR = ACCEPTED_TYPES.join(',');

export type File = {
  type: string;
  size: number;
  name: string;
};

export type FabricEvent = {
  clipboardData?: {
    files: File[];
  };
  dataTransfer?: {
    files: File[];
  };
};

export type ImageUploaderHandler = (
  event: FabricEvent | null | undefined,
  editorCallback: () => void
) => Thunk;

const getFileFromFabricEvent = (event: FabricEvent) => {
  if (event.clipboardData) {
    // user pasted a file
    return event.clipboardData.files[0];
  } else if (event.dataTransfer) {
    // user dragged a file onto
    return event.dataTransfer.files[0];
  }

  // should never happen, but trust no one
  return null;
};

const handleImageUpload: ImageUploaderHandler = (
  event: FabricEvent | null | undefined,
  editorCallback: () => void
) => (dispatch: BucketDispatch) => {
  if (!event) {
    // user activated the image upload icon
    dispatch(chooseImage(editorCallback));
    return;
  }

  const file = getFileFromFabricEvent(event);

  if (!file || ACCEPTED_TYPES.indexOf(file.type) === -1) {
    return;
  }

  dispatch(uploadImage(file, editorCallback));
};

export { handleImageUpload };
