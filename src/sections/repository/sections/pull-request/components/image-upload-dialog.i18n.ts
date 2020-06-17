import { defineMessages } from 'react-intl';

export default defineMessages({
  uploadImageTitle: {
    id: 'frontbucket.repository.pullRequest.uploadImageTitle',
    description: 'Title for image uploading dialog',
    defaultMessage: 'Upload image',
  },
  uploadImageInstructions: {
    id: 'forntbucket.repository.pullRequest.uploadImageInstructions',
    description: 'Instructions inside image upload dialog',
    defaultMessage: 'Drag and drop... or click here to upload your image',
  },
  genericError: {
    id: 'forntbucket.repository.pullRequest.uploadImageGenericError',
    description: 'Error in image upload dialog',
    defaultMessage: 'Something went wrong with that file. Please try again.',
  },
});
