import { AnalyticsEvent, ObjectBasedSchema } from './types';

export default class Fact<Schema> {
  data: ObjectBasedSchema<Schema> | null | undefined;
  name: string;

  constructor(data?: ObjectBasedSchema<Schema> | null) {
    this.data = data;
  }

  generateEvent(): AnalyticsEvent<Schema> {
    const event: AnalyticsEvent<Schema> = {
      isFact: true,
      name: this.name,
      properties: this.data,
      time: new Date().getTime(),
    };

    if (window && window.location && window.location.href) {
      event.referrer = window.location.href;
    }

    return event;
  }
}
