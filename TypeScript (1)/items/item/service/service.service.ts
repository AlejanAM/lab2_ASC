import { Injectable, Inject } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { CoreConstants } from '../../../../core/core.constants';
import { IAppConfig, APP_CONFIG } from '../../../../../app.config';

@Injectable()
class ServiceService {
  private headers: Headers;
  private requestOptions: RequestOptions;

  constructor(
    private http: Http,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) {
    this.headers = new Headers({
      'Content-Type': 'application/json'
    });
    this.requestOptions = new RequestOptions({
      headers: this.headers
    });
  }

  postService(service: any) {
    return this.http
      .post(`${this.config.API_ENDPOINT_CATALOG}services/create-service`, service, this.requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()),
      (err) => Promise.reject(err));
  }

  putService(service: any) {
    return this.http
      .put(`${this.config.API_ENDPOINT_CATALOG}services/update-service`, service, this.requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()),
      (err) => Promise.reject(err));
  }

  getService(id: any) {
    let params = new URLSearchParams();
    params.set('itemId', id);
    this.requestOptions.search = params;
    return this.http
      .get(`${this.config.API_ENDPOINT_CATALOG}services/show-service`, this.requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()),
      (err) => Promise.reject(err));
  }

  getServices(id: any) {
    let params = new URLSearchParams();
    params.set('organizationId', id);
    this.requestOptions.search = params;
    return this.http
      .get(`${this.config.API_ENDPOINT_CATALOG}services/show-services`, this.requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()),
      (err) => Promise.reject(err));
  }

}
export { ServiceService }
