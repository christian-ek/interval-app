export default interface Interval {
  start: number;
  end: number;

  /**
   * Converts the interval to a string representation.
   * @returns {string} The string representation of the interval in the form "start-end".
   */
  toString(): string;
}

/**
 * Creates an Interval object.
 *
 * @param {number} start - The start of the interval.
 * @param {number} end - The end of the interval.
 * @returns {Interval} The created Interval object.
 */
export function createInterval(start: number, end: number): Interval {
  return {
    start,
    end,
    toString() {
      return `${this.start}-${this.end}`;
    },
  };
}
