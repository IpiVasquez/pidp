import * as multer from 'multer';
import * as _debug from 'debug';
import * as cv from 'opencv';
import * as fs from 'fs';
import {Request, Response} from 'express';
import {Route} from '.';

const debug = _debug('identifier');

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

export const leafIdentifier: Route = {
  route: '/leafIdentifier',
  callback: leafCb,
  method: 'POST'
};

function leafCb(req: Request, res: Response): void {
  debug('Receiving img');
  upload(req, res, (err) => {
    if (err) {
      return res.status(422).send({
        message: 'Unexpected error',
        error: err.message
      });
    }
    debug('Reading img');
    const imgPath = req.file.path;
    cv.readImage(imgPath, (err2, img) => {
      if (err2) {
        return res.status(422).send({
          message: 'Something occurred while processing image',
          error: err2.message
        });
      }
      debug('Processing img');
      img.convertGrayscale();
      img.gaussianBlur([5, 5]);
      // img = img.threshold(100, 200, 'Threshold to Zero');
      img.canny(0, 5);
      debug('Saving img');
      img.save(imgPath);
      const data = <any>fs.readFileSync(imgPath);
      debug('Sending img');
      res.send({
        type: req.file.mimetype,
        img: data
      });
      debug('Deleting tmp files');
      deleteFile(imgPath);
    });
  });
}

function deleteFile(path: string) {
  fs.exists(path, exists => {
    if (exists) {
      fs.unlink(path, () => {});
    }
  });
}
