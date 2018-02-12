/**
 * @author Hector J. Vasquez <ipi.vasquez@gmail.com>
 * @licence Apache License, Version 2.0
 */

import * as path from 'path';
import * as _debug from 'debug';
import * as fs from 'fs';
import * as cv from 'opencv';

import {processImg} from './processImg';
import {stats} from './sci.stats';

const debug = _debug('Training');
const assetsPath = path.join(__dirname, '../../assets/');

/**
 * Gets the necessary knowledge to identify some leaf of some plants.
 */
export async function training() {
  debug('Preparing data');
  const leafs = require(assetsPath + 'info.json');
  const train = [];
  let nLeafTypes = 0;
  for (const leaf in leafs) {
    nLeafTypes++;
    debug(`Processing ${leaf} images`);
    const areaIdx: number[] = [];
    const asymmetry: number[] = [];
    const compacities: number[] = [];
    const entropy: number[] = [];
    const iDeviation: number[] = [];
    const roughnessIdx: number[] = [];
    const uniformity: number[] = [];
    for (const imgPath of leafs[leaf].images) {
      await cv.readImage(assetsPath + imgPath, (err, img) => {
        if (err) {
          throw err;
        }
        // Getting each property of each image
        const properties = processImg(img);
        areaIdx.push(properties.areaIndex);
        asymmetry.push(properties.asymmetry);
        compacities.push(properties.compacity);
        entropy.push(properties.entropy);
        iDeviation.push(properties.iStandardDeviation);
        roughnessIdx.push(properties.roughnessIndex);
        uniformity.push(properties.uniformity);
      });
    }

    // Saving stats
    train.push({
      name: leaf,
      areaIndex: stats(areaIdx),
      asymmetry: stats(asymmetry),
      compacity: stats(compacities),
      entropy: stats(entropy),
      iStandardDeviation: stats(iDeviation),
      roughnessIndex: stats(roughnessIdx),
      uniformity: stats(uniformity)
    });
  }

  debug('Training has been done, saving results');
  fs.writeFileSync(
    assetsPath + 'knowledge.json',
    JSON.stringify(train),
    'utf8'
  );
  debug(`Saved at ${assetsPath}trainResults.json`);
}

// Execute if TRAIN=true is set
if (process.env.TRAIN) {
  training().then(null);
}
