/**
 * @author Hector J. Vasquez <ipi.vasquez@gmail.com>
 * @licence Apache License, Version 2.0
 */

export function mean(array: number[]): number {
  return array.reduce((prev, cur) => prev + cur) / array.length;
}

export function median(array: number[]): number {
  const mid = array.length >> 1;
  if (array.length % 2) {
    return array[mid];
  } else {
    return (array[mid] + array[mid - 1]) / 2;
  }
}

export function standardDeviation(array: number[]): number {
  const avg = mean(array);
  let o = 0;
  array.forEach(e => o += (e - avg) ** 2);
  o /= array.length - 1;
  return Math.sqrt(o);
}

export function stats(array: number[]) {
  const avg = mean(array);
  // Standard deviation to avoid recalculate mean
  let o = 0;
  array.forEach(e => o += (e - avg) ** 2);
  o /= array.length - 1;
  return {
    mean: avg,
    median: median(array),
    standardDeviation: Math.sqrt(o)
  };
}
