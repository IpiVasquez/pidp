import {BoundRect} from './utils';

/**
 * Defines contours class. It will store information about the contours inside
 * an image.
 */
export declare class Contours {
  /**
   * I don't know if this actually has a constructor.
   */
  constructor();

  /**
   * Gets the area of the i-th contour.
   * @param i Element from which the area is wanted.
   * @returns The area of the i-th contour.
   */
  area(i: number): number;

  /**
   * Gets a rectangle which surrounds all of the i-th contour.
   * @param i Element from which the bounding rect is wanted.
   * @returns A bounding rectangle containing the i-th contour.
   */
  boundingRect(i: number): BoundRect;

  /**
   * Counts the number of corners on i-th contour.
   * @param i Contour wanted.
   * @returns Number of corners of i-th contour.
   */
  cornerCount(i: number): number;

  /**
   * Gets the number of contours on this.
   * @returns The number of contours on this.
   */
  size(): number;
}
