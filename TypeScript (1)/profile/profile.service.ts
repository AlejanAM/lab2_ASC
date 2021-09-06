import { Injectable, Inject } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams
} from '@angular/http';
import { Router } from '@angular/router';

import { IAppConfig, APP_CONFIG } from '../../../app.config';

@Injectable()
class ProfileService {

  private headers: Headers;
  private options: RequestOptions;

  constructor(
    private _http: Http,
    private router: Router,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) {
    this.headers = new Headers({
      'Content-Type': 'application/json'
    });
    this.options = new RequestOptions({
      headers: this.headers
    });
  }

  getRoleById(userId: number) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('userId', userId.toString());
    this.options.search = params;
    return this._http.get(`${this.config.API_ENDPOINT_SICID}UsersRoles/get-roles-userid`, this.options)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: Error) => Promise.reject(err));
  }

  getUnSubscribeRoles(userId: number, isEditor: boolean, isAdmin: boolean) {
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}UsersRoles/get-unsubscribe-roles-user?userId=${userId}&isEditor=${isEditor}&isAdministrator=${isAdmin}`)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: Error) => Promise.reject(err));
  }

  createUserRole(roles, userId) {
    const body = {
      roles: roles,
      userId: userId
    };
    const bodyString = JSON.stringify(body);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this._http
      .post(`${this.config.API_ENDPOINT_SICID}UsersUserRoles/create-role-subscribe`, bodyString, options)
      .toPromise()
      .then((response: Response) => Promise.resolve(response))
      .catch((err: any) => Promise.reject(err));
  }

  getRolesToEditBySuperUser(idUser: number){
    let params: URLSearchParams = new URLSearchParams();
    params.set('userId', idUser.toString());
    this.options.search = params;
    return this._http.get(`${this.config.API_ENDPOINT_SICID}UsersUserRoles/getRoleByUserSuperUser`, this.options)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: Error) => Promise.reject(err));
  }

  postSubscribeRol(idUser, idRoles) {
    const bodyRoles = {
      idUser: idUser,
      idRoles: {
        roles: idRoles
      }
    };
    const bodyRolesString = JSON.stringify(bodyRoles);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this._http
      .post(`${this.config.API_ENDPOINT_SICID}UsersUserRoles/postSubscribeRol`, bodyRolesString, options)
      .toPromise()
      .then((response: Response) => {
        this._http.post(`${this.config.API_ENDPOINT_CATALOG}DetailEvaluations/postNotificationRolAdministrator`,bodyRoles,options);
        Promise.resolve(response)
      })
      .catch((err: any) => {
        Promise.reject(err)
      });
  }
}
export { ProfileService }
