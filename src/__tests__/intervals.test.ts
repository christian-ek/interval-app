import { expect, test } from "vitest";
import { parseIntervals, processIntervals } from "@/lib/intervals";
import Interval, { createInterval } from "@/types/interval";

// Helper function to strip `toString` method for comparison
function stripToString(intervals: Interval[]) {
  return intervals.map(({ start, end }) => ({ start, end }));
}

test("parseIntervals correctly parses valid intervals", () => {
  const intervals = parseIntervals("10-100, 20-30");
  expect(stripToString(intervals)).toEqual([
    { start: 10, end: 100 },
    { start: 20, end: 30 },
  ]);
});

test("processIntervals correctly subtracts intervals", () => {
  const includes = [createInterval(10, 100)];
  const excludes = [createInterval(20, 30)];
  const result = processIntervals(includes, excludes);
  expect(stripToString(result)).toEqual([
    { start: 10, end: 19 },
    { start: 31, end: 100 },
  ]);
});

test("processIntervals handles complex examples correctly", () => {
  const includes = [createInterval(200, 300), createInterval(50, 150)];
  const excludes = [createInterval(95, 205)];
  const result = processIntervals(includes, excludes);
  expect(stripToString(result)).toEqual([
    { start: 50, end: 94 },
    { start: 206, end: 300 },
  ]);
});

test("Example 1: Includes: 10-100, Excludes: 20-30", () => {
  const includes = [createInterval(10, 100)];
  const excludes = [createInterval(20, 30)];
  const result = processIntervals(includes, excludes);
  expect(stripToString(result)).toEqual([
    { start: 10, end: 19 },
    { start: 31, end: 100 },
  ]);
});

test("Example 2: Includes: 50-5000, 10-100, Excludes: (none)", () => {
  const includes = [createInterval(50, 5000), createInterval(10, 100)];
  const excludes: Interval[] = [];
  const result = processIntervals(includes, excludes);
  expect(stripToString(result)).toEqual([{ start: 10, end: 5000 }]);
});

test("Example 3: Includes: 200-300, 50-150, Excludes: 95-205", () => {
  const includes = [createInterval(200, 300), createInterval(50, 150)];
  const excludes = [createInterval(95, 205)];
  const result = processIntervals(includes, excludes);
  expect(stripToString(result)).toEqual([
    { start: 50, end: 94 },
    { start: 206, end: 300 },
  ]);
});

test("Example 4: Includes: 200-300, 10-100, 400-500, Excludes: 410-420, 95-205, 100-150", () => {
  const includes = [
    createInterval(200, 300),
    createInterval(10, 100),
    createInterval(400, 500),
  ];
  const excludes = [
    createInterval(410, 420),
    createInterval(95, 205),
    createInterval(100, 150),
  ];
  const result = processIntervals(includes, excludes);
  expect(stripToString(result)).toEqual([
    { start: 10, end: 94 },
    { start: 206, end: 300 },
    { start: 400, end: 409 },
    { start: 421, end: 500 },
  ]);
});
