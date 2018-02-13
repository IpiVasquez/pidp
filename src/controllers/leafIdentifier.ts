import * as multer from 'multer';
import * as _debug from 'debug';
import * as cv from 'opencv';
import * as fs from 'fs';
import {Request, Response} from 'express';
import {Route} from '.';
import {processImg} from '../utils/processImg';
import * as path from 'path';

const debug = _debug('identifier');

// Sets where some images will be stored and how they'll be treated.
const storage = multer.diskStorage({
  destination: process.env.TMP_DIR,
  filename: (req, file, cb) => {
    let ext;
    if (file.mimetype === 'image/jpeg') {
      ext = '.jpg';
    } else if (file.mimetype === 'image/png') {
      ext = '.png';
    } else if (file.mimetype === 'image/bmp') {
      ext = '.bmp';
    } else {
      ext = '.unknown';
    }
    cb(null, (+new Date()) + ext);
  }
});
const upload = multer({
  storage: storage,
}).single('leafImg');

// Where the source of knowledge is ...
const knowledge = <any[]>require(path.join(__dirname, '../../assets/knowledge.json'));
// Info about description and files corresponding to each leaf type
const info = require(path.join(__dirname, '../../assets/info.json'));

// Defining route
export const leafIdentifier: Route = {
  route: '/leafIdentifier',
  callback: leafCb,
  method: 'POST'
};

function leafCb(req: Request, res: Response): void {
  debug('Receiving leaf image');
  upload(req, res, (err) => {
    if (err) {
      return res.status(422).send({
        message: 'Unexpected error',
        error: err.message
      });
    }
    debug('Reading image');
    const imgPath = req.file.path;
    cv.readImage(imgPath, (err2, img) => {
      if (err2) {
        return res.status(422).send({
          message: 'Something occurred while processing image',
          error: err2.message
        });
      }
      debug('Processing image');
      const imgInfo = processImg(img);
      const leafName = identifyLeaf(imgInfo);
      debug('Sending resulting images');
      // Sending as buffer: e.g. images.phase.data contains the
      // buffer
      res.send({
        type: req.file.mimetype,
        images: {
          preprocessed: imgInfo.phases.preprocessed.toBuffer(),
          interest: imgInfo.phases.interest.toBuffer(),
          segmented: imgInfo.phases.segmented.toBuffer(),
        },
        description: leafName.map(ln => info[ln].description)
      });
      debug('Deleting tmp files');
      // Deleting created images
      deleteFile(imgPath);
    });
  });
}

function identifyLeaf(leaf: any) {
  const rough = [];
  const area = [];
  const comp = [];
  const uni = [];
  const ent = [];
  const iDev = [];
  const asy = [];

  for (let i = 0; i < knowledge.length; i++) {
    // Checking area index match
    let mean = knowledge[i].areaIndex.mean;
    let standardDeviation = knowledge[i].areaIndex.standardDeviation;
    if (mean + standardDeviation > leaf.areaIndex &&
      mean - standardDeviation < leaf.areaIndex) {
      area.push(i);
    }
    // Checking compacity match
    mean = knowledge[i].compacity.mean;
    standardDeviation = knowledge[i].compacity.standardDeviation;
    if (mean + standardDeviation > leaf.compacity &&
      mean - standardDeviation < leaf.compacity) {
      comp.push(i);
    }
    // Checking roughness index match
    mean = knowledge[i].roughnessIndex.mean;
    standardDeviation = knowledge[i].roughnessIndex.standardDeviation;
    if (mean + standardDeviation > leaf.roughnessIndex &&
      mean - standardDeviation < leaf.roughnessIndex) {
      rough.push(i);
    }
    // Checking uniformity match
    mean = knowledge[i].uniformity.mean;
    standardDeviation = knowledge[i].uniformity.standardDeviation;
    if (mean + standardDeviation > leaf.uniformity &&
      mean - standardDeviation < leaf.uniformity) {
      uni.push(i);
    }
    // Checking iStandardDeviation match
    mean = knowledge[i].iStandardDeviation.mean;
    standardDeviation = knowledge[i].iStandardDeviation.standardDeviation;
    if (mean + standardDeviation > leaf.iStandardDeviation &&
      mean - standardDeviation < leaf.iStandardDeviation) {
      iDev.push(i);
    }
    // Checking entropy match
    mean = knowledge[i].entropy.mean;
    standardDeviation = knowledge[i].entropy.standardDeviation;
    if (mean + standardDeviation > leaf.entropy &&
      mean - standardDeviation < leaf.entropy) {
      ent.push(i);
    }
    // Checking asymmetry match
    mean = knowledge[i].asymmetry.mean;
    standardDeviation = knowledge[i].asymmetry.standardDeviation;
    if (mean + standardDeviation > leaf.asymmetry &&
      mean - standardDeviation < leaf.asymmetry) {
      asy.push(i);
    }
  }

  let maxOccur = 0;
  let bestMatches: number[] = [];
  for (let i = 0; i < knowledge.length; i++) {
    let occur = 0;
    if (area.indexOf(i) !== -1) {
      occur++;
    }
    if (rough.indexOf(i) !== -1) {
      occur++;
    }
    if (comp.indexOf(i) !== -1) {
      occur++;
    }
    if (uni.indexOf(i) !== -1) {
      occur++;
    }
    if (ent.indexOf(i) !== -1) {
      occur++;
    }
    if (asy.indexOf(i) !== -1) {
      occur++;
    }
    if (iDev.indexOf(i) !== -1) {
      occur++;
    }
    if (occur > maxOccur) {
      maxOccur = occur;
      bestMatches = [i];
    } else if (occur === maxOccur) {
      bestMatches.push(i);
    }
  }

  debug(`Best matches: ${bestMatches.join(', ')}`);
  return bestMatches.map(i => knowledge[i].name);
}

function deleteFile(path: string) {
  fs.exists(path, exists => {
    if (exists) {
      fs.unlink(path, () => {});
    }
  });
}
