import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import {
  CANCEL_IMAGE_CHOICE,
  UPLOAD_IMAGE,
  uploadImage,
  getImageUploadError,
} from 'src/redux/pull-request/image-upload-reducer';
import { ImageUploadDialog } from '../components/image-upload-dialog';

const mapStateToProps = (state: BucketState) => ({
  errorMessage: getImageUploadError(state),
});

const cancelImageChoice = () => ({ type: CANCEL_IMAGE_CHOICE });
const rejectFileDrop = (errorMessage: string) => ({
  type: UPLOAD_IMAGE.ERROR,
  payload: errorMessage,
});

const mapDispatchToProps = {
  onClose: cancelImageChoice,
  onAcceptedFileDropped: uploadImage,
  onRejectedFileDropped: rejectFileDrop,
};

const ConnectedImageUploadDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageUploadDialog);

export { ConnectedImageUploadDialog };
