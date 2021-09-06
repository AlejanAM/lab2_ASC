import { Injectable, Inject } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams
} from '@angular/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { CoreConstants } from '../../core/core.constants';
import { IAppConfig, APP_CONFIG } from '../../../app.config';

@Injectable()
class ItemsService {

  constructor(
    private _http: Http,
    private router: Router,
    private routeActivated: ActivatedRoute,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) { }

  getItems(modeToConsult: number, isProduct: boolean) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('isProduct', isProduct.toString());
    params.set('modeToConsult', modeToConsult.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_CATALOG}Items/getAll`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().items))
      .catch((err: any) => Promise.reject(err));
  }

  getItemDetail(user: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('id', user.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_CATALOG}Items/getAllInformation`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  postItemInspection(itemId: number, idUser: number = null,description: string = null) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const httpData = (description === null) ? { idItem: itemId } : {
      idItem: itemId,
      description: description
    };
    return this._http
      .post(`${this.config.API_ENDPOINT_CATALOG}Items/postItemInspection`,httpData, options)
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch((err: any) => Promise.reject(err));
  }

  getSearchWord(name: string, isProduct: boolean) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('name', name);
    params.set('isProduct', isProduct.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_CATALOG}Items/get-item-search-by-name`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().items))
      .catch((err: any) => Promise.reject(err));
  }

  getSearchCategorie(father: number, level: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('father', father.toString());
    params.set('level', level.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_CATALOG}Categories/getCategoriesByFather`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().categories))
      .catch((err: any) => Promise.reject(err));
  }

  getProductsCategories(categoryId: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('categoryId', categoryId.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_CATALOG}Items/getProductByCategorie`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().items))
      .catch((err: any) => Promise.reject(err));
  }

  getSearchGroup(father: number, level: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('father', father.toString());
    params.set('level', level.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_CATALOG}Groups/getGroupsByFather`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().groups))
      .catch((err: any) => Promise.reject(err));
  }

  getProductsGroups(groupId: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('groupId', groupId.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_CATALOG}Items/getProductByGroup`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().items))
      .catch((err: any) => Promise.reject(err));
  }

  getSearchSector() {
    return this._http
      .get(`${this.config.API_ENDPOINT_CATALOG}SectorClassifications`)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  getServicesSector(sectorId: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('sectorId', sectorId.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_CATALOG}Items/getServiceBySector`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().items))
      .catch((err: any) => Promise.reject(err));
  }

  postDeleteItem(itemId: number, idUser: number) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this._http
      .post(`${this.config.API_ENDPOINT_CATALOG}Items/postDeleteItem`, {itemIdPk: itemId }, options)
      .toPromise()
      .then((response: Response) => {
        this.router.navigate(['/catalog/page-dashboard']);
        return response.json();
      })
      .catch((err: any) => Promise.reject(err));
  }

  deleteManyItems (itemToDelete: Object) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this._http
      .post(`${this.config.API_ENDPOINT_CATALOG}Items/postManyItemsDelete`, {
        itemToDelete: { "itemToDelete": itemToDelete }
      }, options)
      .toPromise()
      .then((response: Response) => response.json())
      .catch((err: any) => Promise.reject(err));
  }

}
export { ItemsService }
