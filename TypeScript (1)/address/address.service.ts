import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { CoreConstants } from '../../core/core.constants';
import { IAppConfig, APP_CONFIG } from '../../../app.config';

@Injectable()
class AddressService {
  private headers: Headers;
  private requestOptions: RequestOptions;

  constructor(
    private http: Http,
    @Inject(APP_CONFIG) public config: IAppConfig,
  ) {
    this.headers = new Headers({
      'Content-Type': 'application/json'
    });
    this.requestOptions = new RequestOptions({
      headers: this.headers
    });
  }

  getAddressesByOrganizationId(id: any) {
    let params = new URLSearchParams();
    params.set('organizationId', id);
    this.requestOptions.search = params;
    return this.http
      .get(`${this.config.API_ENDPOINT_SICID}Addresses/getAddressesByOrganizationId`, this.requestOptions)
      .toPromise()
      .then((Response: Response) => Promise.resolve(Response.json()),
        (err) => Promise.reject(err));
  }

}
export { AddressService }
