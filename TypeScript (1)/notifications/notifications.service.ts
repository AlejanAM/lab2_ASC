import { Injectable, Inject } from '@angular/core';
import { 
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams 
} from '@angular/http';

import { CoreConstants } from '../../core/core.constants';
import { IAppConfig, APP_CONFIG } from '../../../app.config';

@Injectable()
class NotificationsService {
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

  getNewsNotifications(idUser: number) {
    let params = new URLSearchParams();
    params.set('idUser', idUser.toString());
    this.requestOptions.search = params;
    return this.http
      .get(`${this.config.API_ENDPOINT_CATALOG}DetailEvaluations/getAllNotificationUnviewed`, this.requestOptions)
      .toPromise()
      .then((Response: Response) => Promise.resolve(Response.json()),
      (err) => Promise.reject(err));
  }

  updatedNotificationsViewed (notificationsViewed: Object) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.config.API_ENDPOINT_CATALOG}DetailEvaluations/postNotificationsViews`, {
      notificationsViewed	: {"notificationsViewed" : notificationsViewed}
    }, options)
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

}
export { NotificationsService }
