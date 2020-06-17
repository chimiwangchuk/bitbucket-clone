import React, { PureComponent } from 'react';
import { injectIntl, FormattedRelative, InjectedIntl } from 'react-intl';

import { differenceInDays, getNonFuture, localeFormat } from '../utils/time';
import ISODate, { ISODateString } from './iso-date';

type RelativeDateProps = {
  date: Date | string;
  intl: InjectedIntl;
};

class RelativeDate extends PureComponent<RelativeDateProps> {
  render() {
    const { intl } = this.props;

    const date = getNonFuture(this.props.date);

    return differenceInDays(date) > 7 ? (
      <ISODate date={date} />
    ) : (
      <span title={intl.formatDate(date, localeFormat)}>
        <FormattedRelative value={date} />
      </span>
    );
  }
}
export default injectIntl(RelativeDate);

export function relativeDateString(
  date: Date | string | null,
  intl: InjectedIntl
): string {
  if (!date) {
    return '';
  }

  const adjustedDate = getNonFuture(date);

  return differenceInDays(adjustedDate) > 7
    ? ISODateString(adjustedDate)
    : intl.formatRelative(adjustedDate);
}
