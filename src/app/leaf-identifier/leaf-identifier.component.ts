import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../api.service';

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
  img: ImgData;
  processedImg: ImgData;

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
    // Set procedure for when file is read
    reader.onload = () => {
      this.img = {
        src: reader.result,
        alt: file.name
      };
    };
    // Send image to server t be processed
    this.api.submitLeafImg(file).subscribe(d => {
      const imgData = arrayBufferToBase64(d.img.data);
      this.processedImg = {
        src: `data:${d.type};base64,${imgData}`,
        alt: 'Processed img'
      };
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
