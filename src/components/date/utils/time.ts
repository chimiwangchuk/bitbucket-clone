export const oneDay = 24 * 60 * 60 * 1000;

export const convertToDate = (timeStamp: Date | string | number): Date => {
  if (timeStamp instanceof Date) {
    return timeStamp;
  }
  if (typeof timeStamp === 'number') {
    return new Date(timeStamp);
  }
  return new Date(timeStamp.toString());
};

export const getNonFuture = (timeStamp: Date | string | number): Date => {
  const date = convertToDate(timeStamp);
  const now = new Date();
  if (date > now) {
    return now;
  }
  return date;
};

export const differenceInDays = (
  timeStamp: Date | string | number,
  relativeTo: number = Date.now()
): number => {
  // convert the Date returned by convertToDate to a number for arithmitic
  const difference = relativeTo - Number(convertToDate(timeStamp));
  return difference / oneDay;
};

const addPadding = (paddingToAdd: number): string =>
  paddingToAdd < 10 ? `0${paddingToAdd}` : `${paddingToAdd}`;

// getISODate() is used to get an ISO-formatted date string in local time
// Note that the hyphens are non-breaking hyphens (not regular hyphens)
export const getISODate = (dt: Date): string =>
  `${addPadding(dt.getFullYear())}‑${addPadding(
    dt.getMonth() + 1
  )}‑${addPadding(dt.getDate())}`;

export const localeFormat = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'short',
};
