import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { CoreConstants } from '../../core/core.constants';
import { IAppConfig, APP_CONFIG } from '../../../app.config';

@Injectable()
class SectorService {
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

  getSectors() {
    return this.http
      .get(`${this.config.API_ENDPOINT_CATALOG}SectorClassifications`, this.requestOptions)
      .toPromise()
      .then((Response: Response) => Promise.resolve(Response.json()),
      (err) => Promise.reject(err));
  }

}
export { SectorService }
