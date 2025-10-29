import moment, { Moment } from "moment";

type TimeValue = Moment | string | number | Date;
export type Duration =
  | "y"
  | "M"
  | "w"
  | "d"
  | "h"
  | "m"
  | "s"
  | "ms"
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "second"
  | "millisecond"
  | "years"
  | "months"
  | "weeks"
  | "days"
  | "hours"
  | "seconds"
  | "milliseconds";

/**
 * Returns a boolean determining if a time value is past a certain point in time.
 * @param {TimeValue} incomingTime - The time you want to know is after
 * @param {TimeValue} comparedTime -The time that you want to compare to (to see if the first value is after)
 * @returns {Boolean}
 */
export const isAfter = (incomingTime: TimeValue, comparedTime: TimeValue) => {
  return moment(incomingTime).isAfter(comparedTime);
};

/**
 * Returns a boolean determining if a time value is before a certain point in time.
 * @param {TimeValue} incomingTime - The time you want to know is before
 * @param {TimeValue} comparedTime -The time that you want to compare to (to see if the first value is before)
 * @returns {Boolean}
 */
export const isBefore = (incomingTime: TimeValue, comparedTime: TimeValue) => {
  return moment(incomingTime).isBefore(comparedTime);
};

/**
 * Returns an ISO String of time in the future based on timeToAddInMs arg
 * @param {number} timeToAddInMs - ms as a number or string
 * @param {TimeValue} time - time you want to add ms to, defaults to now if no value is provided.
 * @returns {Date}
 */
export const addTimeInMs = (
  timeToAddInMs: number | string,
  time: TimeValue = new Date()
) => {
  return moment.utc(time).add(timeToAddInMs, "ms").toDate();
};

/**
 * Returns an Date that is the a time in the future based on span and unit args
 * @param {number} span - number of X time duration you want to add
 * @param {Duration} unit - type of time duration you want to add
 * @param {TimeValue} time - time you want to add duration to, defaults to now if no value is provided.
 * @returns {Date}
 */
export const addTimeInDuration = (
  span: number,
  unit: Duration,
  time: TimeValue = new Date()
) => {
  return moment.utc(time).add(span, unit).toDate();
};

/**
 * Returns an ISO String of time in the past based on timeToSubtractInMs arg
 * @param {number} timeToSubtractInMs - ms as a number or string
 * @param {TimeValue} time - time you want to sub ms from, defaults to now if no value is provided.
 * @returns {Date}
 */
export const subtractTimeInMs = (
  timeToSubtractInMs: number | string,
  time: TimeValue = new Date()
) => {
  return moment.utc(time).subtract(timeToSubtractInMs, "ms").toDate();
};

/**
 * Returns an Date that is the a time in the past based on span and unit args
 * @param {number} span - number of X time duration you want to sub
 * @param {Duration} unit - type of time duration you want to sub
 * @param {TimeValue} time - time you want to sub duration from, defaults to now if no value is provided.
 * @returns {Date}
 */
export const subtractTimeInDuration = (
  span: number,
  unit: Duration,
  time: TimeValue = new Date()
) => {
  return moment.utc(time).subtract(span, unit).toDate();
};
