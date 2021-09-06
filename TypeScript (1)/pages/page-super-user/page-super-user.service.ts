import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Router} from '@angular/router';

import {CoreConstants} from '../../../core/core.constants';
import {IAppConfig, APP_CONFIG} from '../../../../app.config';

@Injectable()
class PageSuperUserService {
  private headers: Headers;
  private options: RequestOptions;

  constructor(
    private _http: Http,
    private _router: Router,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: this.headers});
  }

  /**
   * Gets a reports of a module and its users
   * @param moduleId
   */
  getModulesUsersReport(moduleId) {
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Users/usersModulesReport?moduleId=${moduleId}`)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  /**
   * Gets a file by its name of the container given
   * @param containerName
   * @param fileName
   */
  getFile(containerName: string, fileName: string) {
    return `${this.config.API_ENDPOINT_SICID}Containers/${containerName}/download/${fileName}`;
  }

  /**
   * Deletes the relation between an user and an organization
   * @param body
   */
  deleteUserByOrganization(body) {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    const params = `userId=${body.userId}&organizationId=${body.organizationId}`;

    return this._http
      .delete(
        `${this.config.API_ENDPOINT_SICID}UsersOrganizations/deleteUserByOrganization?${params}`,
        options
      )
      .toPromise()
      .then((response: Response) => response.json())
      .catch((err: any) => Promise.reject(err));
  }
  getAllUserWithRol() {
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Users/getAllUserWithRol`)
      .toPromise()
      .then((response: Response) => {
        return Promise.resolve(response.json());
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  getAllUserByModule(idModule: number) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('idModule', idModule.toString());
    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Users/getAllUserByModule`, requestOptions)
      .toPromise()
      .then((response: Response) => {
        return Promise.resolve(response.json());
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  getAllUsers() {
    let filter = {
      fields: {
        idPk: true,
        identification: true,
        firstName: true,
        lastName: true,
        email: true
      }
    };
    const params: URLSearchParams = new URLSearchParams();
    params.set('filter', JSON.stringify(filter));
    const requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Users`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  getAllOrganizations() {
    let filter = {
      fields: {
        idPk: true,
        dni: true,
        name: true,
        email: true
      }
    };
    const params: URLSearchParams = new URLSearchParams();
    params.set('filter', JSON.stringify(filter));
    const requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Organizations`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  postNewLegalRepresentative(userId: number, organizationId: number) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let httpData = {
      userId: userId,
      organizationId: organizationId
    };
    return this._http
      .post(
        `${this.config.API_ENDPOINT_SICID}UsersOrganizations/postLegalRepresentative`,
        httpData,
        options
      )
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  getAllOrganizationByAllUsers() {
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}UsersOrganizations/getOrganizationByUser`)
      .toPromise()
      .then((response: Response) => {
        return Promise.resolve(response.json());
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  getAllOrganizationsRoles() {
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}OrganizationsRoles`)
      .toPromise()
      .then((response: Response) => {
        return Promise.resolve(response.json());
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }
}
export {PageSuperUserService};
