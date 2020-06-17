import { defineMessages } from 'react-intl';

// Design doc for translation here:
// https://hello.atlassian.net/wiki/spaces/BB/pages/516963695/CoreX+-+CRF+Design+spec+Visual+diffs
export default defineMessages({
  error: {
    id: 'frontbucket.imageDiffs.error',
    description:
      'Error message telling the user that we could not load an image',
    defaultMessage: "We couldn't load this image.",
  },
  // For image diff header.
  before: {
    id: 'frontbucket.imageDiffs.before',
    description: `Before as in "before any changes have been made to this
      image" or the left picture on an image diff`,
    defaultMessage: `Before`,
  },
  after: {
    id: 'frontbucket.imageDiffs.after',
    description: `After as in "after any changes have been made to this image"
        or the right picture on an image diff`,
    defaultMessage: `After`,
  },
  removed: {
    id: 'frontbucket.imageDiffs.removed',
    description: `Header text for removed images in a pull request image diff`,
    defaultMessage: `Removed`,
  },
  added: {
    id: 'frontbucket.imageDiffs.added',
    description: `Header text for added images in a pull request image diff`,
    defaultMessage: `Added`,
  },

  // For image diff actual image.
  oldImage: {
    id: 'frontbucket.imageDiffs.oldImage',
    description: `Refers to any removed image in an image diff`,
    defaultMessage: `Old image`,
  },
  newImage: {
    id: 'frontbucket.imageDiffs.newImage',
    description: `Refers to any added image in an image diff`,
    defaultMessage: `New image`,
  },

  // For image diff footer.
  width: {
    id: 'frontbucket.imageDiffs.width',
    description: `The term for the horizontal dimension of the image`,
    defaultMessage: `width`,
  },
  height: {
    id: 'frontbucket.imageDiffs.height',
    description: `The term for the vertical dimension of the image`,
    defaultMessage: `height`,
  },
});
