import { defineMessages } from 'react-intl';

export default defineMessages({
  sidebarLabel: {
    id: 'frontbucket.sidebar.sidebarLabel',
    description:
      'Label for a sidebar containing cards with information complementary to the main page content',
    defaultMessage: 'Sidebar',
  },
  expandIconTooltip: {
    id: 'frontbucket.sidebar.expandIconTooltip',
    description:
      'Tooltip shown when hovering over the expand icon in the collapsed sidebar',
    defaultMessage: 'Click or tap to expand or press the ] (right bracket) key',
  },
  toggleButtonExpandLabel: {
    id: 'frontbucket.sidebar.toggleButtonExpandLabel',
    description:
      'Label for the button to expand the sidebar when it is collapsed.',
    defaultMessage:
      'Click or tap to expand the sidebar or press the ] (right bracket) key',
  },
  toggleButtonCollapseLabel: {
    id: 'frontbucket.sidebar.toggleButtonCollapseLabel',
    description:
      'Label for the button to collapse the sidebar when it is expanded.',
    defaultMessage:
      'Click or tap to collapse the sidebar or press the ] (right bracket) key',
  },
});
