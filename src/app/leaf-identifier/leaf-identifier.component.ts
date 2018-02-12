import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../api.service';
import {highlightAllUnder} from 'prismjs';

interface ImgData {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-leaf-identifier',
  templateUrl: './leaf-identifier.component.html',
  styleUrls: ['./leaf-identifier.component.css']
})
export class LeafIdentifierComponent {
  form: FormGroup;

  description: string[];

  img: ImgData;
  preprocessed: ImgData;
  interest: ImgData;
  segmented: ImgData;

  loaded = false;

  constructor(private fb: FormBuilder,
              private api: ApiService) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      img: null
    });
  }

  imgReader(evt) {
    if (!evt.target.files || !evt.target.files[0]) {
      console.log('Empty event or file');
      return;
    }

    const reader = new FileReader();
    const file = evt.target.files[0];
    // Checking some flags
    this.loaded = false;
    this.description = undefined;
    // Set procedure for when file is read
    reader.onload = () => {
      this.img = {
        src: reader.result,
        alt: 'Original'
      };
    };
    // Send image to server t be processed
    this.api.submitLeafImg(file).subscribe(d => {
      // Getting description
      this.description = d.description;
      // Generating src string for images
      const preprocessedData = arrayBufferToBase64(d.images.preprocessed.data);
      const interestData = arrayBufferToBase64(d.images.interest.data);
      const segmentedData = arrayBufferToBase64(d.images.segmented.data);
      // Adding src strings
      this.preprocessed = {
        src: `data:${d.type};base64,${preprocessedData}`,
        alt: 'Preprocesada'
      };
      this.segmented = {
        src: `data:${d.type};base64,${segmentedData}`,
        alt: 'Segmentada'
      };
      this.interest = {
        src: `data:${d.type};base64,${interestData}`,
        alt: 'Región de interés'
      };
      // Load completed!
      this.loaded = true;
    });
    // Try to read file
    reader.readAsDataURL(file);
  }
}

/**
 * Transforms an image buffer to be able to use as src value.
 * @param buffer The image as an array.
 * @returns A binary string to be used as image src.
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}
