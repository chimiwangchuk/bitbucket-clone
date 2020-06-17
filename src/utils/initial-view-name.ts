const meta: Element | null | undefined = document.head
  ? document.head.querySelector('meta[name=bb-view-name]')
  : undefined;

export default meta ? (meta as HTMLMetaElement).content : '';
