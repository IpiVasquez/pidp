import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment as env} from '../environments/environment';

interface LeafResponse {
  data: {
    type: string;
    data: number[];
  };
}

@Injectable()
export class ApiService {
  imgUrl = env.apiURL + '/leafIdentifier';

  constructor(private http: HttpClient) { }

  submitLeafImg(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('leafImg', file);
    return this.http.post(this.imgUrl, formData);
  }
}
