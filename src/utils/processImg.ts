/**
 * @author Hector J. Vasquez <ipi.vasquez@gmail.com>
 * @licence Apache License, Version 2.0
 */

import * as cv from 'opencv';
import * as std from 'std.ts';
import {mean, stats} from './sci.stats';

const threshMaxVal = 255;
const threshMinVal = 0;

export function processImg(img: cv.Matrix) {
  // Working on blue channel
  const preprocessed = img.split()[2];
  // Pre-processing
  preprocessed.equalizeHist();
  preprocessed.brightness(1.6, 0);
  preprocessed.gaussianBlur([127, 127]);

  // Segmenting with threshold
  const segmented = preprocessed.threshold(
    threshMinVal,
    threshMaxVal,
    'Binary Inverted',
    'Otsu'
  );

  // Getting area of interest
  const interest = new cv.Matrix(img.height(), img.width());
  const aux = segmented.copy();
  const contours = aux.findContours();
  let maxArea = 0;
  let maxIdx = 0;
  for (let i = 0; i < contours.size(); i++) {
    if (contours.area(i) > maxArea) {
      maxIdx = i;
      maxArea = contours.area(i);
    }
  }
  interest.drawContour(contours, maxIdx, [0, 255, 0]);

  // Applying descriptor to image
  const moment = contours.moments(maxIdx);
  // Mass center
  const x = Math.floor(moment.m10 / moment.m00);
  const y = Math.floor(moment.m01 / moment.m00);
  const compacity = 4 * Math.PI * maxArea /
    (contours.arcLength(maxIdx, true) ** 2);
  const nrd = getNRD(x, y, contours.points(maxIdx));
  const nrdMean = mean(nrd);
  // Getting area & roughness index
  let rIdx = 0;
  let aIdx = 0;
  for (let i = 0; i < nrd.length; i++) {
    if (nrd.length - 1 !== i) {
      rIdx += nrd[i] - nrd[i + 1];
    }
    let value;
    if ((value = nrd[i] - nrdMean) > 0) {
      aIdx += value;
    }
  }
  aIdx /= nrd.length * nrdMean;
  rIdx /= nrd.length * nrdMean;
  // Getting pixel sample
  const section = getInterestArea(segmented, x, y);
  // Getting intensity values vector
  const intensities = [];
  const p = [];
  // Filling array of probabilities to appear
  for (let i = 0; i < 256; i++) {
    p[i] = 0;
  }
  for (let i = 0; i < section.width; i++) {
    for (let j = 0; j < section.height; j++) {
      let val = preprocessed.pixel(section.x + i, section.y + j);
      if (typeof val === 'number') {
        intensities.push(val);
        p[val]++;
      } else {
        throw new Error('Somehow the gray scale images has more colors');
      }
    }
  }
  // Normalizing
  for (let i = 0; i < 256; i++) {
    p[i] /= section.width * section.height;
  }
  // Sorting for stats
  std.algorithm.sort(intensities, 0, intensities.length);
  const iStats = stats(intensities);
  // Pixel intensity standard deviation
  const iStandardDeviation = 1 - 1 / (1 + iStats.standardDeviation);
  // Uniformity, entropy & asymmetry
  let uniformity = 0;
  let asymmetry = 0;
  let entropy = 0;
  for (let i = 0; i < p.length; i++) {
    uniformity += p[i] ** 2;
    asymmetry -= p[i] * (i - iStats.mean) ** 3;
    if (p[i]) {
      entropy -= p[i] * Math.log2(p[i]);
    }
  }
  // Each property calculated before
  return {
    phases: {
      preprocessed: preprocessed,
      segmented: segmented,
      interest: interest
    },
    areaIndex: aIdx,
    asymmetry: asymmetry,
    compacity: compacity,
    entropy: entropy,
    iStandardDeviation: iStandardDeviation,
    roughnessIndex: rIdx,
    uniformity: uniformity
  };
}

/**
 * Gets the normalized radial distances from an area. This area is delimited
 * by the points given.
 * @param x X coordinate of mass center.
 * @param y Y coordinate of mass center.
 * @param points The set of points surrounding the area.
 * @returns Normalized vector of radial distances.
 */
function getNRD(x: number, y: number, points: { x: number; y: number }[]) {
  let distance = 0;
  const distances: number[] = [];

  points.forEach(p => {
    let d = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
    distance += d;
    distances.push(d);
  });

  return distances.map(d => d / distance);
}

/**
 * Gets an area of interest from segmented image. It will be around x and y
 * so its preferred that (x, y) be the mass center.
 * @param segmentedImg Segmented image.
 * @param x Point.
 * @param y Point.
 * @returns A bounding rectangle of the area to inspect.
 */
function getInterestArea(segmentedImg: cv.Matrix, x: number, y: number) {
  let xMin, xMax, yMin, yMax;
  // At least a 40 x 40 area
  for (let i = 50; i > 20; i--) {
    xMin = x - i;
    yMin = y - i;
    xMax = x + i;
    yMax = y + i;
    if (segmentedImg.pixel(xMin, yMin) === threshMaxVal &&
      segmentedImg.pixel(xMin, yMax) === threshMaxVal &&
      segmentedImg.pixel(xMax, yMin) === threshMaxVal &&
      segmentedImg.pixel(xMax, yMax) === threshMaxVal) {
      return {
        x: xMin,
        y: yMin,
        height: yMax - yMin,
        width: xMax - xMin
      };
    }
  }

  return {
    x: xMin,
    y: yMin,
    height: yMax - yMin,
    width: xMax - xMin
  };
}
