export default {
  api: {
    internal: {
      events: () => '/!api/internal/analytics/events',
    },
  },
  xhr: {
    legacyEvents: () => '/xhr/analytics/events',
  },
};
