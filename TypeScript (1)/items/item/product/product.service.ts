import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';

import {IAppConfig, APP_CONFIG} from '../../../../../app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
class ProductService {
  private headers: Headers;
  private requestOptions: RequestOptions;

  constructor(
    private _http: HttpClient,
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

  postProduct(product: any) {
    return this.http
      .post(
        `${this.config.API_ENDPOINT_CATALOG}products/create-product`,
        product,
        this.requestOptions
      )
      .toPromise()
      .then(
        (response: Response) => Promise.resolve(response.json()),
        (err) => Promise.reject(err)
      );
  }

  /**
   * Updates a product views
   * @param idItem
   * @param views
   */
  putProductViews(idItem, views) {
    const params = `?idPk=${idItem}&views=${views}`;
    return this.http
      .get(`${this.config.API_ENDPOINT_CATALOG}Items/itemIncreaseViews${params}`)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }
  /**
   * Post a element of type file on a container, but first validates if the container exist
   * @param productFile
   * @param containerName
   */
  postFile(productFile: any, containerName) {
    return this.existContainer(containerName).then(async (exist) => {
      if (!exist) {
        await this.createFolder(containerName);
        return await this.postFileInContainer(productFile, containerName);
      } else {
        return await this.postFileInContainer(productFile, containerName);
      }
    });
  }

  /**
   * Post a element of type file into a container
   * @param fileToUpload
   * @param containerName
   */
  async postFileInContainer(fileToUpload: File, containerName) {
    const fd = new FormData();
    fd.append('image', fileToUpload, fileToUpload.name);
    return this.http
      .post(`${this.config.API_ENDPOINT_CATALOG}Containers/${containerName}/upload`, fd)
      .toPromise()
      .then(
        (response: Response) => Promise.resolve(response.json()),
        (err) => Promise.reject(err)
      );
  }

  /**
   * Deletes a file inside a container
   * @param fileToUpload
   * @param containerName
   */
  async deleteFileInContainer(fileToUpload: File, containerName) {
    return this.http
      .delete(
        `${this.config.API_ENDPOINT_CATALOG}Containers/${containerName}/files/${fileToUpload}`
      )
      .toPromise()
      .then(
        (response: Response) => Promise.resolve(response.json()),
        (err) => Promise.reject(err)
      );
  }

  /**
   * Creates a container on loopback storage
   * @param nameFolder
   */
  async createFolder(nameFolder: string) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return await this._http
      .post<any>(
        `${this.config.API_ENDPOINT_CATALOG}Containers/newContainer`,
        {
          ctx: nameFolder
        },
        httpOptions
      )
      .toPromise();
  }

  async existContainer(nameContainer) {
    return await this.getContainer().then((container) => {
      for (let list of container) {
        if (list.name === nameContainer) {
          return true;
        }
      }
      return false;
    });
  }

  async getContainer() {
    return await this._http.get<any>(`${this.config.API_ENDPOINT_CATALOG}Containers`).toPromise();
  }

  getFile(containerName: string, fileName: string) {
    return `${this.config.API_ENDPOINT_CATALOG}Containers/${containerName}/download/${fileName}`;
  }

  putProduct(product: any) {
    return this.http
      .put(
        `${this.config.API_ENDPOINT_CATALOG}products/update-product`,
        product,
        this.requestOptions
      )
      .toPromise()
      .then(
        (response: Response) => Promise.resolve(response.json()),
        (err) => Promise.reject(err)
      );
  }

  getProduct(id: any) {
    let params = new URLSearchParams();
    params.set('itemId', id);
    this.requestOptions.search = params;
    return this.http
      .get(`${this.config.API_ENDPOINT_CATALOG}products/show-product`, this.requestOptions)
      .toPromise()
      .then(
        (response: Response) => Promise.resolve(response.json()),
        (err) => Promise.reject(err)
      );
  }

  getProducts(id: any) {
    let params = new URLSearchParams();
    params.set('organizationId', id);
    this.requestOptions.search = params;
    return this.http
      .get(`${this.config.API_ENDPOINT_CATALOG}products/show-products`, this.requestOptions)
      .toPromise()
      .then(
        (response: Response) => Promise.resolve(response.json()),
        (err) => Promise.reject(err)
      );
  }
}
export {ProductService};
