const AddonProvider = {
  // @ts-ignore TODO: fix noImplicitAny error here
  resize: (width, height, context) => {
    context.extension.options.resize(width, height);
  },

  // @ts-ignore TODO: fix noImplicitAny error here
  sizeToParent: (hideFooter, context) => {
    context.extension.options.sizeToParent(hideFooter);
  },
};

export default AddonProvider;
