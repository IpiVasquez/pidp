import {Contours} from './Contours';
import {BoundRect, Color} from './utils';

export declare class Matrix {
    /**
     * Creates a new image with the specified properties.
     * @param {number} rows Number of rows on matrix.
     * @param {number} cols Number of cols on matrix.
     * @param {number} type ???
     * @param {number} fillValue ???
     */
    constructor(rows: number, cols: number, type?: number, fillValue?: number);

    /**
     * Performs Canny's border detection with the specified threshold values.
     * @param lowThreshold Low threshold to consider.
     * @param highThreshold High threshold to consider.
     */
    canny(lowThreshold: number, highThreshold: number): void;

    /**
     * Converts this image to grayscale.
     */
    convertGrayscale(): void;

    /**
     * Converts this image to HSV (Hue, Saturation, Value) scale.
     */
    convertHSVscale(): void;

    /**
     * Copies this image into a new Matrix.
     * @returns A new image copied from this.
     */
    copy(): Matrix;

    /**
     * Crops the image at (x, y) with a size of width * height.
     * @param x Horizontal coordinate.
     * @param y Vertical coordinate.
     * @param width Horizontal crop size.
     * @param height Vertical crop size.
     * @returns A cropped image of this.
     */
    crop(x: number, y: number, width: number, height: number): Matrix;

    /**
     * Detects all objects matching what xml file describe.
     * @param xmlPath Path for xml file which describes patterns to search.
     * @param options
     * @param cb To be call after detection gets completed.
     */
    detectObject(xmlPath: string, options: any, cb: (err: Error, objects: BoundRect) => void): void;

    /**
     * TODO: Not sure about this description.
     * Performs iteration dilations using the given structuring element for
     * dilation.
     * @param iterations The number of times to iterate.
     * @param structEl The structuring element for dilation (default 3x3).
     */
    dilate(iterations: number, structEl?: any): void;

    /**
     * Draws on this image a set of given contours or one of the contours from
     * the given set..
     * @param contours contours wanted to be draw.
     * @param idx If provided, this will draw only idx-th contour.
     * @param color Color for the set.
     * @param thickness Contour thickness.
     * @param lineType Type of line to draw contour.
     */
    drawContour(contours: Contours, idx?: number, color?: Color, thickness?: number, lineType?: any): void;

    /**
     * Draws an ellipse on this image at (x, y) with a width and height.
     * @param x X coordinate of ellipse's center.
     * @param y Y coordinate of ellipse's center.
     * @param width Horizontal size.
     * @param height Vertical size.
     */
    ellipse(x: number, y: number, width: number, height: number): void;

    /**
     * Finds all contours on a given image. It is prefferable to have executed
     * an edge detection algorithm before.
     * @returns The contours on image.
     */
    findContours(): Contours;

    /**
     * Performs a gaussian blur on this image.
     * @param maskSize Mask's size to use for this blur. The size must be
     * specified into an array as [width, height].
     */
    gaussianBlur(maskSize: number[]): void;

    /**
     * TODO: Not sure about this description.
     * Performs iteration erotions using the given structuring element for
     * erotion.
     * @param iterations The number of times to iterate.
     * @param structEl The structuring element for erotion (default 3x3).
     */
    erode(iterations: number, structEl?: any): void;

    /**
     * Gets this image's height.
     * @returns This image's height.
     */
    height(): number;

    /**
     * Saves this images in the specified path.
     * @param path Path to store image.
     * @param cb Callback to be executed when saving is done.
     */
    save(path: string, cb?: (err: Error, code: any) => void): void;

    /**
     * Performs a threshold on this,
     * @param low Low threshold.
     * @param high High threshold.
     * @param type Threshold type to perform.
     * @returns The thresholded image.
     */
    threshold(low: number, high: number, type?: string): Matrix;

    /**
     * Gets this image's width.
     * @returns This image's width.
     */
    width(): number;
}
