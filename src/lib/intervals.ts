import Interval, { createInterval } from "@/types/interval";

/**
 * Parses a string of intervals and returns an array of Interval objects.
 *
 * @param {string} [val] - The string representation of intervals.
 * @returns {Interval[]} - An array of Interval objects.
 */
export function parseIntervals(val?: string): Interval[] {
  if (!val || val.trim() === "") return [];
  return val.split(",").map((interval) => {
    const [start, end] = interval.split("-").map(Number);
    return createInterval(start, end);
  });
}

/**
 * Checks if all intervals have valid numbers.
 *
 * @param {Interval[]} intervals - The array of Interval objects.
 * @returns {boolean} - True if all intervals have valid numbers, false otherwise.
 */
export function areValidNumbers(intervals: Interval[]): boolean {
  return (
    intervals.length === 0 ||
    intervals.every(({ start, end }) => !isNaN(start) && !isNaN(end))
  );
}

/**
 * Checks if the start of each interval is less than or equal to the end.
 *
 * @param {Interval[]} intervals - The array of Interval objects.
 * @returns {boolean} - True if the start is less than or equal to the end for each interval, false otherwise.
 */
export function isStartLessThanOrEqualToEnd(intervals: Interval[]): boolean {
  return (
    intervals.length === 0 || intervals.every(({ start, end }) => start <= end)
  );
}

/**
 * Checks if all interval values are integers.
 *
 * @param {Interval[]} intervals - The array of Interval objects.
 * @returns {boolean} - True if all interval values are integers, false otherwise.
 */
export function areIntegers(intervals: Interval[]): boolean {
  return (
    intervals.length === 0 ||
    intervals.every(
      ({ start, end }) => Number.isInteger(start) && Number.isInteger(end)
    )
  );
}

/**
 * Checks if the input string has a valid format for intervals (not allowing negative numbers).
 *
 * @param {string} [val] - The string representation of intervals.
 * @returns {boolean} - True if the input string has a valid format, false otherwise.
 */
export function hasValidFormat(val?: string): boolean {
  if (!val) return true;
  const intervals = val.split(",");
  return intervals.every((interval) => /^\d+-\d+$/.test(interval.trim()));
}

/**
 * Checks if two intervals overlap.
 *
 * @param {Interval} interval1 - The first interval.
 * @param {Interval} interval2 - The second interval.
 * @returns {boolean} - True if the intervals overlap, false otherwise.
 */
function isOverlapping(interval1: Interval, interval2: Interval): boolean {
  return !(interval2.end < interval1.start || interval2.start > interval1.end);
}

/**
 * Subtracts an exclude interval from an include interval.
 *
 * @param {Interval} include - The include interval.
 * @param {Interval} exclude - The exclude interval.
 * @returns {Interval[]} - The resulting intervals after subtraction.
 */
function subtractInterval(include: Interval, exclude: Interval): Interval[] {
  let result: Interval[] = [];
  if (!isOverlapping(include, exclude)) {
    result.push(include);
  } else {
    if (exclude.start > include.start) {
      result.push(createInterval(include.start, exclude.start - 1));
    }
    if (exclude.end < include.end) {
      result.push(createInterval(exclude.end + 1, include.end));
    }
  }
  return result;
}

/**
 * Processes remaining intervals with excludes.
 *
 * @param {Interval[]} remainingIntervals - The array of remaining intervals.
 * @param {Interval[]} excludes - The array of exclude intervals.
 * @returns {Interval[]} - The resulting intervals after processing.
 */
function processRemainingIntervals(
  remainingIntervals: Interval[],
  excludes: Interval[]
): Interval[] {
  for (let exclude of excludes) {
    let newIntervals: Interval[] = [];
    for (let interval of remainingIntervals) {
      newIntervals = newIntervals.concat(subtractInterval(interval, exclude));
    }
    remainingIntervals = newIntervals;
  }
  return remainingIntervals;
}

/**
 * Merges overlapping intervals.
 *
 * @param {Interval[]} intervals - The array of Interval objects.
 * @returns {Interval[]} - The array of merged Interval objects.
 */
function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length === 0) return [];

  // Sort intervals by start
  intervals.sort((a, b) => a.start - b.start);

  // Initialize merged with the first interval
  // This serves as the starting point for comparison and merging
  let merged: Interval[] = [intervals[0]];

  intervals.slice(1).forEach((current) => {
    let lastMerged = merged[merged.length - 1];
    if (lastMerged.end < current.start - 1) {
      // If the current interval does not overlap, add it to the merged array
      merged.push(current);
    } else {
      // If the current interval overlaps, merge it with the last interval in the merged array
      lastMerged.end = Math.max(lastMerged.end, current.end);
    }
  });

  return merged;
}

/**
 * Main function to process includes and excludes intervals.
 *
 * @param {Interval[]} includes - The array of include intervals.
 * @param {Interval[]} excludes - The array of exclude intervals.
 * @returns {Interval[]} - The resulting intervals after processing includes and excludes.
 */
export function processIntervals(
  includes: Interval[],
  excludes: Interval[]
): Interval[] {
  let result: Interval[] = [];
  for (let include of includes) {
    let remainingIntervals = processRemainingIntervals([include], excludes);
    result = result.concat(remainingIntervals);
  }
  return mergeIntervals(result);
}
