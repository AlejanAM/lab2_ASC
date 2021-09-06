import {Injectable, Inject} from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable, from} from 'rxjs';
import {CoreConstants} from '../../core/core.constants';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {Router} from '@angular/router';

import * as moment from 'moment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

const URL_GET_REGION = 'https://ubicaciones.paginasweb.cr/provincia';

@Injectable()
class OrganizationService {
  private headers: Headers;
  private options: RequestOptions;
  protected headers_b: HttpHeaders;

  constructor(
    private _http: Http,
    private _router: Router,
    protected httpClient: HttpClient = null,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) {
    this.headers_b = new HttpHeaders().set('Content-Type', 'application/json');
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: this.headers});
  }

  /**
   * Function to get a list of the model without filter
   * @param modelName
   */
  public getNormalListOfModel(modelName: string) {
    const url = `${this.config.API_ENDPOINT_SICID}${modelName}`;
    const options = {headers: this.headers};
    return this._http
      .get(url, options)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  /**
   * Function to get a list of the model with filter
   * @param modelName
   * @param filter
   */
  public getModelListFiltered<T>(modelName: string, filter: any = null): Observable<T[]> {
    const url = `${this.config.API_ENDPOINT_SICID}${modelName}`;
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers_b: this.headers, params};
    return this.httpClient.get<T[]>(url, options).pipe();
  }

  /**
   * Gets a report of organizations by location
   * @param statusType
   */
  getOrganizationLocationReport(idProvince, idCanton, idDistritc) {
    const params = `?idProvince=${idProvince}&idCanton=${idCanton}&idDistricts=${idDistritc}`;
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Organizations/orgLocationReport${params}`)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  /**
   * Gets a report of organizations
   * @param statusType
   */
  getOrganizationStatusReport(statusType) {
    return this._http
      .get(
        `${this.config.API_ENDPOINT_SICID}Organizations/orgStatusReport?typeReport=${statusType}`
      )
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  /**
   * Gets a report of ONG organizations and their views based on the org status
   * @param viewsFilter
   */
  getOrganizationViewsReport(viewsFilter) {
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Organizations/orgViewsReport?viewsType=${viewsFilter}`)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  /**
   * Post an organization id into organizationOrganizationRole
   * @param organizationIdPk
   * @param organizationRolesIdPk
   */
  postOrganizationOrganizationRole(organizationIdPk, organizationRolesIdPk) {
    const params = {
      organizationIdPk: organizationIdPk,
      organizationRolesIdPk: organizationRolesIdPk
    };
    return this._http
      .post(`${this.config.API_ENDPOINT_SICID}OrganizationsOrganizationRoles`, params)
      .toPromise();
  }

  /**
   * Gets a file by its name of the container given
   * @param containerName
   * @param fileName
   */
  getFile(containerName: string, fileName: string) {
    return `${this.config.API_ENDPOINT_SICID}Containers/${containerName}/download/${fileName}`;
  }

  checkOrganizationIsNotPending(isChecked: boolean, isApproved: boolean) {
    if (isChecked && !isApproved) {
      return true;
    } else {
      return false;
    }
  }

  createOrganization(
    organizations: Object,
    regions: Object,
    legalPermissions: Object,
    address: Object,
    userId: number,
    organizationRole: number
  ) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this._http
      .post(
        `${this.config.API_ENDPOINT_SICID}Organizations/postOrganizations`,
        {
          organization: organizations,
          regions: regions,
          legalPermissions: legalPermissions,
          address: address,
          organizationRole: organizationRole,
          idUser: userId
        },
        options
      )
      .toPromise()
      .then((response: Response) => response.json())
      .catch((err: any) => Promise.reject(err));
  }

  putOrganization(organization: any) {
    return this._http
      .put(
        `${this.config.API_ENDPOINT_SICID}Organizations/update-organization`,
        organization,
        this.options
      )
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  getOrganizationstype() {
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}OrganizationsTypes/getOrganizationstypeName`)
      .toPromise()
      .then((response: Response) => {
        return Promise.resolve(response.json());
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  getOrganizationsType(organizationTypeId: number) {
    let params: URLSearchParams = new URLSearchParams();
    let requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}OrganizationsTypes/${organizationTypeId}`)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  getAllOrganizationsApproved(organizationRole) {
    const params = `organizationRole=${organizationRole}`;
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Organizations/getAllOrganizationApproved?${params}`)
      .toPromise()
      .then((response: Response) => {
        return Promise.resolve(response.json().organizations);
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  getOrganizations(approvedCondition, checkedCondition, organizationRole) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('approvedCondition', approvedCondition.toString());
    params.set('checkedCondition', checkedCondition.toString());
    params.set('organizationRole', organizationRole);
    const requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Organizations/getAll`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().organizations))
      .catch((err) => Promise.reject(err));
  }

  getOrganization(userId: any, isApproved: boolean, isChecked: boolean) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('userId', userId.toString());
    params.set('isApproved', isApproved.toString());
    params.set('isChecked', isChecked.toString());

    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Organizations/getOrganizationByUser`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json().organizations))
      .catch((err: any) => Promise.reject(err));
  }

  getOrganizationDetail(organization: number) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('organizationID', organization.toString());
    let requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Organizations/getAllInformation`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  /**
   * Updates an organization views
   * @param idOrganization
   * @param views
   */
  putOrganizationViews(idOrganization, views) {
    const params = `?idPkOrg=${idOrganization}&views=${views}`;
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Organizations/organizationIncreaseViews${params}`)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  postUserOrganization(idOrganization: number, idUser: number) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let httpData = {
      userIdPk: idUser,
      organizationIdPk: idOrganization
    };
    return this._http
      .post(`${this.config.API_ENDPOINT_SICID}UsersOrganizations`, httpData, options)
      .toPromise()
      .then((response: Response) => {
        Promise.resolve(response.json());
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  postOrganizationInspection(
    idOrganization: number,
    idUser: number = null,
    description: string = ''
  ) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let httpData =
      description === null
        ? {idOrganization: idOrganization}
        : {
            idOrganization: idOrganization,
            description: description
          };
    return this._http
      .post(
        `${this.config.API_ENDPOINT_SICID}Organizations/postOrganizationInspection`,
        httpData,
        options
      )
      .toPromise()
      .then((response: Response) => {
        let notificatioData = {
          idUserOrganizationOwner: response.json().userOwner,
          idOrganization: idOrganization,
          description: description
        };
        this._http
          .post(
            `${this.config.API_ENDPOINT_CATALOG}DetailEvaluations/postNotificationOrganization`,
            notificatioData,
            options
          )
          .toPromise()
          .then((notificationResponse: Response) => {
            return response.json();
          })
          .catch((errNotification: any) => {
            return Promise.reject(errNotification);
          });
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  getProvinces() {
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Provinces`)
      .toPromise()
      .then((response: Response) => {
        return Promise.resolve(response.json());
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  getCantons(canton: string) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('provinceId', canton);

    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Cantons/getCantonsByProvinceId`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  getDistricts(canton: string) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('cantonId', canton);

    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Districts/getDistrictsByCantonId`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  getOrganizationsUser(id: any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('userId', id.toString());

    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http
      .get(
        `${this.config.API_ENDPOINT_SICID}Organizations/get-organizations-userid`,
        requestOptions
      )
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  setOrganization(formBuilder: FormBuilder, formGroup: FormGroup, organization: any) {
    formGroup.controls.dni.setValue(organization.details.dni);
    formGroup.controls.name.setValue(organization.details.name);
    formGroup.controls.email.setValue(organization.details.email.replace(/\s/g, ''));
    formGroup.controls.web.setValue(organization.details.web);
    formGroup.controls.telephone.setValue(
      organization.details.telephone.replace(/\s/g, '').replace('-', '')
    );
    formGroup.controls.legalRepresentative.setValue(organization.details.legalRepresentative);
    formGroup.controls.schedule.setValue(organization.details.schedule);
    formGroup.controls.reaches.setValue(organization.details.reaches);
    formGroup.controls.mision.setValue(organization.details.mision);
    formGroup.controls.vision.setValue(organization.details.vision);
    formGroup.controls.objective.setValue(organization.details.objetive);
    formGroup.controls.organizationType.setValue(organization.details.organizationsTypesidPk);
    this.setAssemblies(formBuilder, formGroup, organization.details.assembly);
    this.setWazeAddresses(formBuilder, formGroup, organization.details.wazeAddress);
    this.setSocialNetworks(formGroup, organization.details.socialNetworks);
    this.setRegionsLocalizations(formBuilder, formGroup, organization.regions);
    this.setOperationDays(formGroup, organization.details.dayOperations);
    this.setSectors(formBuilder, formGroup, organization.address);
    this.setLegalPermissions(formBuilder, formGroup, organization.legalPermissions);
  }

  setAssemblies(formBuilder: FormBuilder, formGroup: FormGroup, assemblies: any) {
    if (assemblies.length > 0) {
      let assemblyArray = formGroup.controls.assemblies as FormArray;
      for (let index = 0; index < assemblies.length; index++) {
        this.addAssemblyField(formBuilder, formGroup);
        let assemblyGroup = assemblyArray.controls[index] as FormGroup;
        assemblyGroup.controls.assembly.setValue(assemblies[index]);
      }
    } else {
      this.addAssemblyField(formBuilder, formGroup);
    }
  }

  setWazeAddresses(formBuilder: FormBuilder, formGroup: FormGroup, wazeAddresses: any) {
    if (wazeAddresses.length > 0) {
      let wazeAddressArray = formGroup.controls.wazeAddresses as FormArray;
      for (let index = 0; index < wazeAddresses.length; index++) {
        this.addWazeAddressesField(formBuilder, formGroup);
        let wazeAddressGroup = wazeAddressArray.controls[index] as FormGroup;
        wazeAddressGroup.controls.wazeAddress.setValue(wazeAddresses[index]);
      }
    }
  }

  setLegalPermissions(formBuilder: FormBuilder, formGroup: FormGroup, legalPermissions: any) {
    if (legalPermissions.length > 0) {
      let legalPermissionArray = formGroup.controls.legalPermissions as FormArray;
      for (let index = 0; index < legalPermissions.length; index++) {
        this.addLegalPermissionField(formBuilder, formGroup);
        let legalPermissionGroup = legalPermissionArray.controls[index] as FormGroup;
        legalPermissionGroup.controls.idPk.setValue(legalPermissions[index].idPk);
        legalPermissionGroup.controls.name.setValue(legalPermissions[index].name);
        legalPermissionGroup.controls.description.setValue(legalPermissions[index].description);
        legalPermissionGroup.controls.OrganizationsIdPk.setValue(
          legalPermissions[index].OrganizationsIdPk
        );

        let expirationDateParsed = moment(legalPermissions[index].expirationDate).format(
          'YYYY-MM-DD'
        );
        legalPermissionGroup.controls.expirationDate.setValue(expirationDateParsed);
      }
    }
  }

  setSectors(formBuilder: FormBuilder, formGroup: FormGroup, sectors: any) {
    if (sectors.length > 0) {
      let sectorArray = formGroup.controls.sectors as FormArray;
      for (let index = 0; index < sectors.length; index++) {
        this.addSectorField(formBuilder, formGroup);
        let sectorGroup = sectorArray.controls[index] as FormGroup;
        sectorGroup.controls.idPk.setValue(sectors[index].idPk);
        sectorGroup.controls.address.setValue(sectors[index].address);
        sectorGroup.controls.OrganizationsIdPk.setValue(sectors[index].OrganizationsIdPk);
      }
    }
  }

  setSocialNetworks(formGroup: FormGroup, socialNetworks: any) {
    let socialNetworkGroup = formGroup.controls.socialNetworks as FormGroup;
    socialNetworks.map((socialNetwork) => {
      let key = Object.keys(socialNetwork)[0];
      if (key === 'facebook') {
        socialNetworkGroup.controls.facebook.setValue(socialNetwork[key]);
      } else if (key === 'twitter') {
        socialNetworkGroup.controls.twitter.setValue(socialNetwork[key]);
      } else if (key === 'instagram') {
        socialNetworkGroup.controls.instagram.setValue(socialNetwork[key]);
      } else if (key === 'whatsapp') {
        socialNetworkGroup.controls.whatsapp.setValue(socialNetwork[key]);
      }
    });
  }

  setRegionsLocalizations(formBuilder: FormBuilder, formGroup: FormGroup, regions: any) {
    let buildLocalizations = this.buildRegionLocalization(regions);
    let regionArray = formGroup.controls.regions as FormArray;
    buildLocalizations.provinces.map((localization, index) => {
      this.addRegionsField(formBuilder, formGroup);
      let regionGroup = regionArray.controls[index] as FormGroup;
      regionGroup.controls.idPk.setValue(buildLocalizations.ids[index]);
      regionGroup.controls.province.setValue(localization);
      regionGroup.controls.canton.setValue(buildLocalizations.cantons[index]);
      this.getCantons(localization);
      regionGroup.controls.district.setValue(buildLocalizations.districts[index]);
      this.getDistricts(buildLocalizations.districts[index]);
    });
  }

  setOperationDays(formGroup: FormGroup, operationDays: any) {
    let daysToOperationGroup = formGroup.controls.daysToOperation as FormGroup;
    operationDays.map((operationDay) => {
      if (operationDay.day === 'monday') {
        let mondayGroup = daysToOperationGroup.controls.monday as FormGroup;
        mondayGroup.controls.available.setValue(operationDay.available);
        mondayGroup.controls.begin.setValue(operationDay.begin);
        mondayGroup.controls.end.setValue(operationDay.end);
        mondayGroup.controls.typeBegin.setValue(operationDay.typeBegin);
        mondayGroup.controls.typeEnd.setValue(operationDay.typeEnd);
      } else if (operationDay.day === 'tuesday') {
        let tuesdayGroup = daysToOperationGroup.controls.tuesday as FormGroup;
        tuesdayGroup.controls.available.setValue(operationDay.available);
        tuesdayGroup.controls.begin.setValue(operationDay.begin);
        tuesdayGroup.controls.end.setValue(operationDay.end);
        tuesdayGroup.controls.typeBegin.setValue(operationDay.typeBegin);
        tuesdayGroup.controls.typeEnd.setValue(operationDay.typeEnd);
      } else if (operationDay.day === 'wednesday') {
        let wednesdayGroup = daysToOperationGroup.controls.wednesday as FormGroup;
        wednesdayGroup.controls.available.setValue(operationDay.available);
        wednesdayGroup.controls.begin.setValue(operationDay.begin);
        wednesdayGroup.controls.end.setValue(operationDay.end);
        wednesdayGroup.controls.typeBegin.setValue(operationDay.typeBegin);
        wednesdayGroup.controls.typeEnd.setValue(operationDay.typeEnd);
      } else if (operationDay.day === 'thursday') {
        let thursdayGroup = daysToOperationGroup.controls.thursday as FormGroup;
        thursdayGroup.controls.available.setValue(operationDay.available);
        thursdayGroup.controls.begin.setValue(operationDay.begin);
        thursdayGroup.controls.end.setValue(operationDay.end);
        thursdayGroup.controls.typeBegin.setValue(operationDay.typeBegin);
        thursdayGroup.controls.typeEnd.setValue(operationDay.typeEnd);
      } else if (operationDay.day === 'friday') {
        let fridayGroup = daysToOperationGroup.controls.friday as FormGroup;
        fridayGroup.controls.available.setValue(operationDay.available);
        fridayGroup.controls.begin.setValue(operationDay.begin);
        fridayGroup.controls.end.setValue(operationDay.end);
        fridayGroup.controls.typeBegin.setValue(operationDay.typeBegin);
        fridayGroup.controls.typeEnd.setValue(operationDay.typeEnd);
      } else if (operationDay.day === 'saturday') {
        let saturdayGroup = daysToOperationGroup.controls.saturday as FormGroup;
        saturdayGroup.controls.available.setValue(operationDay.available);
        saturdayGroup.controls.begin.setValue(operationDay.begin);
        saturdayGroup.controls.end.setValue(operationDay.end);
        saturdayGroup.controls.typeBegin.setValue(operationDay.typeBegin);
        saturdayGroup.controls.typeEnd.setValue(operationDay.typeEnd);
      } else if (operationDay.day === 'sunday') {
        let sundayGroup = daysToOperationGroup.controls.sunday as FormGroup;
        sundayGroup.controls.available.setValue(operationDay.available);
        sundayGroup.controls.begin.setValue(operationDay.begin);
        sundayGroup.controls.end.setValue(operationDay.end);
        sundayGroup.controls.typeBegin.setValue(operationDay.typeBegin);
        sundayGroup.controls.typeEnd.setValue(operationDay.typeEnd);
      }
    });
  }

  addAssemblyField(formBuilder: FormBuilder, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.assemblies;
    element.push(this.initAssemblyField(formBuilder));
  }

  removeAssemblyField(index: number, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.assemblies;
    element.removeAt(index);
  }

  addLegalPermissionField(formBuilder: FormBuilder, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.legalPermissions;
    element.push(this.initLegalPermissionField(formBuilder));
  }

  removeLegalPermissionField(index: number, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.legalPermissions;
    element.removeAt(index);
  }

  addSectorField(formBuilder: FormBuilder, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.sectors;
    element.push(this.initSectorField(formBuilder));
  }

  removeSectorField(index: number, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.sectors;
    element.removeAt(index);
  }

  addWazeAddressesField(formBuilder: FormBuilder, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.wazeAddresses;
    element.push(this.initWazeAddressField(formBuilder));
  }

  removeWazeAddressesField(index: number, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.wazeAddresses;
    element.removeAt(index);
  }

  addRegionsField(formBuilder: FormBuilder, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.regions;
    element.push(this.initRegionField(formBuilder));
  }

  removeRegionsField(index: number, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.regions;
    element.removeAt(index);
  }

  initAssemblyField(formBuilder: FormBuilder) {
    const assemblyElement = formBuilder.group({
      assembly: ['']
    });
    return assemblyElement;
  }

  initLegalPermissionField(formBuilder: FormBuilder) {
    const legalPermissionElement = formBuilder.group({
      idPk: [''],
      name: ['', [Validators.required, Validators.maxLength(60)]],
      description: ['', Validators.required],
      expirationDate: ['', Validators.required],
      OrganizationsIdPk: ['']
    });
    return legalPermissionElement;
  }

  initSectorField(formBuilder: FormBuilder) {
    const sectorElement = formBuilder.group({
      idPk: [''],
      address: ['', Validators.required],
      OrganizationsIdPk: ['']
    });
    return sectorElement;
  }

  initWazeAddressField(formBuilder: FormBuilder) {
    const wazeAddressElement = formBuilder.group({
      wazeAddress: ['']
    });
    return wazeAddressElement;
  }

  initRegionField(formBuilder: FormBuilder) {
    const regionElement = formBuilder.group({
      idPk: [''],
      province: ['', Validators.required],
      canton: ['', Validators.required],
      district: ['', Validators.required]
    });
    return regionElement;
  }

  organizationFormat(organizationSource: any, organizationId?: number, isExternComponent?: any) {
    const organization = {
      idPk: organizationId ? organizationId : '',
      dni: organizationSource.dni,
      name: organizationSource.name,
      email: organizationSource.email,
      web: organizationSource.web,
      telephone: organizationSource.telephone,
      legalRepresentative: organizationSource.legalRepresentative,
      assembly: this.buildAssemblyDBFormat(organizationSource.assemblies),
      socialNetworks: this.buildSocialNetworksDBFormat(organizationSource.socialNetworks),
      wazeAddress: this.buildWazeAddressDBFormat(organizationSource.wazeAddresses),
      schedule: organizationSource.schedule,
      reaches: organizationSource.reaches,
      mision: organizationSource.mision,
      vision: organizationSource.vision,
      objetive: organizationSource.objective,
      dayOperations: this.buildDaysToOperationDBFormat(organizationSource.daysToOperation),
      isApproved: isExternComponent ? true : false,
      isChecked: true,
      organizationsTypesidPk: organizationSource.organizationType
    };

    return organization;
  }

  regionFormat(regionSource: any) {
    let buildRegions = [];

    regionSource.regions.map((region) => {
      let buildRegion = {
        idPk: region.idPk,
        localization:
          'Provincia : ' +
          region.province +
          ', Cantón : ' +
          region.canton +
          ', Distrito : ' +
          region.district
      };

      buildRegions.push(buildRegion);
    });

    regionSource.regions = buildRegions;

    const region = {
      organizationRegions: regionSource.regions
    };

    return region;
  }

  legalPermissionFormat(legalPermissionSource: any) {
    const legalPermission = {
      organizationLegalPermissions: legalPermissionSource.legalPermissions
    };

    return legalPermission;
  }

  addressFormat(addressSource: any) {
    const address = {
      organizationAddresses: addressSource.sectors
    };

    return address;
  }

  buildWazeAddressDBFormat(wazeAddressesSource: any) {
    let wazeAddressesFormat = [];
    wazeAddressesSource.map((wazeAddresses) => {
      wazeAddressesFormat.push(wazeAddresses.wazeAddress);
    });
    return wazeAddressesFormat;
  }

  buildAssemblyDBFormat(assembliesSource: any) {
    let assembliesFormat = [];
    assembliesSource.map((assemblies) => {
      assembliesFormat.push(assemblies.assembly);
    });
    return assembliesFormat;
  }

  buildDaysToOperationDBFormat(operationDays: any) {
    let daysFormat = [];
    Object.keys(operationDays).map((key) => {
      if (key === 'monday' && operationDays[key]) {
        operationDays[key].day = 'monday';
      } else if (key === 'tuesday' && operationDays[key]) {
        operationDays[key].day = 'tuesday';
      } else if (key === 'wednesday' && operationDays[key]) {
        operationDays[key].day = 'wednesday';
      } else if (key === 'thursday' && operationDays[key]) {
        operationDays[key].day = 'thursday';
      } else if (key === 'friday' && operationDays[key]) {
        operationDays[key].day = 'friday';
      } else if (key === 'saturday' && operationDays[key]) {
        operationDays[key].day = 'saturday';
      } else if (key === 'sunday' && operationDays[key]) {
        operationDays[key].day = 'sunday';
      }
      daysFormat.push(operationDays[key]);
    });

    return daysFormat;
  }

  buildSocialNetworksDBFormat(socialNetworks: any) {
    let socialNetworkFormat = [];
    Object.keys(socialNetworks).map((key) => {
      if (key === 'facebook') {
        socialNetworkFormat.push({
          facebook: socialNetworks[key]
        });
      } else if (key === 'twitter') {
        socialNetworkFormat.push({
          twitter: socialNetworks[key]
        });
      } else if (key === 'instagram') {
        socialNetworkFormat.push({
          instagram: socialNetworks[key]
        });
      } else if (key === 'whatsapp') {
        socialNetworkFormat.push({
          whatsapp: socialNetworks[key]
        });
      }
    });
    return socialNetworkFormat;
  }

  buildRegionLocalization(regions: any) {
    let buildRegion = {
      ids: [],
      provinces: [],
      cantons: [],
      districts: []
    };

    regions.map((region) => {
      let buildLocalization = region.localization.split(',');
      let buildProvince = buildLocalization[0].split(':');
      let buildCanton = buildLocalization[1].split(':');
      let buildDistrict = buildLocalization[2].split(':');

      buildRegion.ids.push(region.idPk);
      buildRegion.provinces.push(buildProvince[1].trim());
      buildRegion.cantons.push(buildCanton[1].trim());
      buildRegion.districts.push(buildDistrict[1].trim());
    });

    return buildRegion;
  }

  deleteManyOrganizations(organizationToDelete: Object) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this._http
      .post(
        `${this.config.API_ENDPOINT_SICID}Organizations/postManyOrganizationDelete`,
        {
          organizationToDelete: {organizationToDelete: organizationToDelete}
        },
        options
      )
      .toPromise()
      .then((response: Response) => response.json())
      .catch((err: any) => Promise.reject(err));
  }

  getOrganizationsByRegions(
    province: number,
    canton: number,
    district: number,
    organizationRole: number
  ) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('province', province.toString());
    params.set('canton', canton.toString());
    params.set('district', district.toString());
    params.set('organizationRoleIdPk', organizationRole.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http
      .get(
        `${this.config.API_ENDPOINT_SICID}Organizations/getOrganizationsByRegions`,
        requestOptions
      )
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }

  getOrganizationsBySearchWord(word: string, organizationRole: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('name', word);
    params.set('organizationRoleIdPk', organizationRole.toString());
    const requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http
      .get(`${this.config.API_ENDPOINT_SICID}Organizations/getSearchedByWord`, requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err: any) => Promise.reject(err));
  }
}
export {OrganizationService};
