import { Injectable, Inject } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams
} from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { catchError, map, tap } from "rxjs/operators";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  FormArray,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { CoreConstants } from '../../core/core.constants';
import { IAppConfig, APP_CONFIG } from '../../../app.config';
import { IndicatorsCount } from '../../statistics/indicators/shared/indicators.model';

@Injectable()
class UserService {

  private headers: Headers;
  private httpHeaders: HttpHeaders;
  private options: RequestOptions;

  constructor(
    private _http: Http,
    private http: HttpClient,
    private router: Router,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) {
    this.headers = new Headers({
      'Content-Type': 'application/json'
    });
    this.options = new RequestOptions({
      headers: this.headers
    });
    this.httpHeaders = new HttpHeaders()
      .set("Content-Type", "application/json");
  }

  createUser(body: Object, roles: Object, isAdminCreating: boolean) {
    let bodyString = {
      user: body,
      roles: roles,
      isAdminCreatingUser: isAdminCreating
    };
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.config.API_ENDPOINT_SICID}Users/postUsersEditors`, bodyString, options)
      .toPromise()
      .then((response: Response) => {
        if (response.json().user.name === 'ValidationError') {
          return Promise.reject(response.json().user);
        } else {
          return response.json();
        }
      })
      .catch((err: any) => Promise.reject(err));
  }

  putUser(user: Object) {
    const body = {
      user: user
    };
    const headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http
      .put(`${this.config.API_ENDPOINT_SICID}Users/update-user`, body, options)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  /**
   * Updates the user data without sending and email
   * @param user 
   */
  putUserData(user: Object) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http
      .put(`${this.config.API_ENDPOINT_SICID}Users/replaceUserData`, user, options)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  getUsers(idRol: number, isChecked: boolean, isApproved: boolean) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('idRol', idRol.toString());
    params.set('isChecked', isChecked.toString());
    params.set('isApproved', isApproved.toString());
    let requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http.get(`${this.config.API_ENDPOINT_SICID}/Users/getAllUserByRol/`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().users))
      .catch((err: any) => Promise.reject(err));
  }

  getIndicatorUsersByRole(searchTerm: string, roleId: number, isChecked: boolean, isApproved: boolean, limit: number, skip: number): Observable<IndicatorsCount> {
    const url = `${this.config.API_ENDPOINT_SICID}/Users/get-all-indicator-users-by-role`;
    searchTerm = searchTerm ? searchTerm : '';
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('roleId', roleId.toString())
      .set('isChecked', isChecked.toString())
      .set('isApproved', isApproved.toString())
      .set('limit', limit.toString())
      .set('skip', skip.toString());
    const options = {
      headers: this.httpHeaders,
      params: params,
    };
    return this.http.get<IndicatorsCount>(url, options);
  }

  getUserDetail(user: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('id', user.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http.get(`${this.config.API_ENDPOINT_SICID}/Users/getAllInformation/`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  postUserInspection(idUser: number, idRol: number, idAdminUser: number = null, description: string = null) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let httpData = (description === null) ? {
      idUser: idUser,
      idRol: idRol
    } :
      {
        idUser: idUser,
        idRol: idRol,
        description: description
      };
    return this._http
      .post(`${this.config.API_ENDPOINT_SICID}/UsersUserRoles/postUserRolInspection`, httpData, options)
      .toPromise()
      .then((response: Response) => {
        this._http.post(`${this.config.API_ENDPOINT_CATALOG}/DetailEvaluations/postNotificationRolInspection`, httpData, options)
          .toPromise()
          .then((responseNotification: Response) => response.json())
          .catch((errNotification: any) => errNotification);
      })
      .catch((err: any) => Promise.reject(err));
  }

  verifyEmail(email: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('email', email);
    this.options.search = params;
    return this._http.get(`${this.config.API_ENDPOINT_SICID}Users/verify-email`, this.options)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: Error) => Promise.reject(err));
  }

  changePassword(userId: number, password: string) {
    const body = {
      userId: userId,
      password: password
    };
    return this._http.put(`${this.config.API_ENDPOINT_SICID}Users/change-password`, body, this.options)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  postEmailVerification(idUser: number) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.config.API_ENDPOINT_SICID}/Users/postEmailVerification`, {
      idUser: idUser
    }, options)
      .toPromise()
      .then((response: Response) => response.json())
      .catch((err: any) => Promise.reject(err));
  }

  postDeleteUser(idUserDeleted: number, idUser: number) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.config.API_ENDPOINT_SICID}Users/postDeleteUser`, { idUser: idUserDeleted }, options)
      .toPromise()
      .then((response: Response) => {
        this.router.navigate(['page-dashboard']);
        return response.json();
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  getRolesEditors(): Observable<any> {
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}/UsersRoles/getAllEditors`);
    //      .map((roles) => roles.json());
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({
          notEquivalent: true
        });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  initRolesField(formBuilder: FormBuilder) {
    const rolesElement = formBuilder.group({
      rol: ['']
    });
    return rolesElement;
  }

  removeRolesField(index: number, formBuilder: FormBuilder, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.roles;
    element.removeAt(index);
  }

  addRolesField(formBuilder: FormBuilder, formGroup: FormGroup, roles: any) {
    const element = <FormArray>formGroup.controls.roles;
    if (element.length !== roles.length) {
      element.push(this.initRolesField(formBuilder));
    } else {
      // put a validation message here...
    }
  }

  backendRolesFormat(roles: any): any {
    let backendFormat = {
      userRoles: []
    };

    roles.userRoles.map((role, index) => {
      let item = {
        rol: role.id
      };
      backendFormat.userRoles.push(item);
    });
    return backendFormat;
  }

  prepareRolesForBackend(roles: any) {
    let isEmpty = this.isRoleNotEmpty(roles);
    let backendRoles = {
      userRoles: []
    };

    if (!isEmpty) {
      let role = {
        id: CoreConstants.rolConsultant
      };
      backendRoles.userRoles.push(role);
    } else {
      backendRoles.userRoles = roles.userRoles;
    }
    return this.backendRolesFormat(backendRoles);
  }

  isRoleNotEmpty(roles: any) {

    if (roles.userRoles.length > 0) {
      return roles.userRoles.find(role => !!role);
    }
    return false;
  }

  rolesFormat(rolesSource: any) {
    const roles = {
      userRoles: rolesSource.roles
    };

    return roles;
  }
}
export { UserService }
