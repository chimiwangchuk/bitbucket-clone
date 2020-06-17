import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import parse from 'date-fns/parse';
import { isDate } from 'lodash-es';

import { getISODate, localeFormat } from '../utils/time';

type ISODateProps = {
  date: Date | string;
  intl: InjectedIntl;
};

// @ts-ignore TODO: fix noImplicitAny error here
const isNaN = obj => obj !== obj; // eslint-disable-line no-self-compare

export default injectIntl(
  class ISODate extends PureComponent<ISODateProps> {
    render() {
      const { intl } = this.props;
      let dateTime = '';
      const dt =
        typeof this.props.date === 'string'
          ? parse(this.props.date)
          : this.props.date;

      // check if valid Date
      if (isNaN(dt.getTime())) {
        return null;
      }

      if (dt && isDate(dt)) {
        dateTime = dt.toString();
      }

      return (
        <time dateTime={dateTime} title={intl.formatDate(dt, localeFormat)}>
          {getISODate(dt)}
        </time>
      );
    }
  }
);

/**
 * Same as the ISODate component, but returns a string instead of
 * an element.
 */
export function ISODateString(date: Date | string) {
  const dt = typeof date === 'string' ? parse(date) : date;

  if (isNaN(dt.getTime())) {
    return '';
  }

  return getISODate(dt);
}
