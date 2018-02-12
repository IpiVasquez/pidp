import * as cv from 'opencv';

declare const process: NodeJS.Process;

const GREEN = [0, 255, 0];

cv.readImage(process.argv[2] || 'assets/Bugambilia/1.jpg', (err, img) => {
  if (err) {
    throw err;
  }

  console.log(img.height(), img.width());
  img.convertGrayscale();
  img.gaussianBlur([3, 3]);
  img.canny(100, 200);
  //  phases.dilate(5);
  const contours = img.findContours();
  let largestArea = 0;
  let largestIdx = -1;

  for (let i = 0; i < contours.size(); i++) {
    if (contours.area(i) > largestArea) {
      largestIdx = i;
      largestArea = contours.area(i);
    }
  }

  const test = new cv.Matrix(img.height(), img.width());
  test.drawContour(contours, largestIdx, GREEN);
  test.save('test.jpg');
  img.save('out.jpg');
});
