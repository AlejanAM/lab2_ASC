import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { CoreConstants } from '../../core/core.constants';
import { IAppConfig, APP_CONFIG } from '../../../app.config';

@Injectable()
class TypeAttentionService {
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

  getTypesAttention(isProduct: boolean) {
    let params = new URLSearchParams();
    params.set('isProduct', isProduct.toString());
    this.requestOptions.search = params;
    return this.http
      .get(`${this.config.API_ENDPOINT_CATALOG}typeattentions/get-types-attention`, this.requestOptions)
      .toPromise()
      .then((Response: Response) => Promise.resolve(Response.json()),
      (err) => Promise.reject(err));
  }

}
export { TypeAttentionService }
