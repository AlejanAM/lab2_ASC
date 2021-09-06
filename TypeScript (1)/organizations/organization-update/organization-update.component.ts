
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';

import { OrganizationService } from '../organization.service';
import { SharedService } from '../../../shared/shared.service';
import { ModalNotificationService } from '../../../utils/modal/notifications/modal-notifications.service';
import { CoreConstants } from '../../../core/core.constants';

@Component({
  selector: 'app-organization-update',
  templateUrl: './organization-update.component.html',
  styleUrls: [
    './organization-update.component.scss',
  ],
  providers: [OrganizationService]
})
class OrganizationUpdateComponent implements OnInit {

  public organizationForm: FormGroup;
  public showMessage: boolean;
  public isSuccessful: boolean;
  public isAdded: number;
  public info: string;
  public isCatalog: boolean;
  public roleUser: number;
  public organizationDetail: any;
  public organizationTypes: any;
  public regions: any;
  public provinces: any;
  public provinceKeys: any;
  public cantons: any;
  public cantonKeys: any;
  public districtKeys: any;
  public districts: any;
  public organizationSelected: number;
  public provinceSelected: string;
  public cantonSelected: string;
  public districtSelected: string;
  public organizationId : number;
  public userId: number;
  public next: number;

  constructor(
    public sharedService: SharedService,
    private formBuilder: FormBuilder,
    private notificationService: ModalNotificationService,
    private organizationService: OrganizationService,
    private _route: ActivatedRoute,
    private router: Router
  ) {
    this.organizationDetail = {};
    this.regions = {
      provinces: [],
      cantons: [],
      districts: []
    };
    this.isAdded = 0;
    this.info = 'Acerca de la Entidad';
    this.next = 0;
    this.showMessage = false;
    this.isSuccessful = false;
    this.isCatalog = false;
  }

  ngOnInit() {
    this.roleUser = +localStorage.getItem('rolId');
    this.isCatalog = (this.roleUser === CoreConstants.rolEditor || this.roleUser === CoreConstants.rolAdministrator) ? true : false;
    this._route.params.subscribe(params => {
      this.organizationId = +params.organizationIdPk;
      this.userId = +params.userIdPk;
    });
    this.formConfiguration();
    this.loadOrganizationDependencies()
      .then(() => this.organizationService.getOrganizationDetail(this.organizationId))
      .then(this.handleOrganizationDetail.bind(this))
      .catch((err) => observableThrowError(true));
  }

  getWizardClassName() {
    let className = 'catalog-wizard';
    if (!this.isCatalog) {
      className = 'ong-wizard';
    }
    return className;
  }

  formConfiguration() {
    this.organizationForm = this.formBuilder.group({
      dni: ['', [
        Validators.required,
      ]],
      name: ['', [
        Validators.required,
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)
      ]],
      web: ['', [
        Validators.maxLength(250),
      ]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]/)
      ]],
      legalRepresentative: ['', [
        Validators.required,
      ]],
      assemblies: this.formBuilder.array([]),
      socialNetworks: this.formBuilder.group({
        twitter: [''],
        facebook: [''],
        instagram: [''],
        whatsapp: ['']
      }),
      wazeAddresses: this.formBuilder.array([]),
      schedule: ['', Validators.required],
      reaches: [''],
      mision: ['', Validators.required],
      vision: ['', Validators.required],
      objective: ['', Validators.required],
      organizationType: ['', Validators.required],
      regions: this.formBuilder.array([]),
      daysToOperation: this.formBuilder.group({
        monday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: ['']
        }),
        tuesday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: ['']
        }),
        wednesday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: ['']
        }),
        thursday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: ['']
        }),
        friday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: ['']
        }),
        saturday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: ['']
        }),
        sunday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: ['']
        })
      }),
      legalPermissions: this.formBuilder.array([]),
      sectors: this.formBuilder.array([])
    });
  }

  loadOrganizationDependencies() {
    this._route.params.subscribe(params => {
      this.userId = +params.userIdPk;
    });
    this.getProvinces();
    return this.organizationService.getOrganizationstype()
      .then(this.handleOrganizationType.bind(this))
      .catch((err) => observableThrowError(true));
  }

  handleOrganizationType(response: any) {
    this.organizationTypes = response.names;
    return Promise.resolve();
  }

  handleOrganizationDetail(response: any) {
    this.organizationDetail = response.organization.details;
    this.organizationService.setOrganization(this.formBuilder, this.organizationForm, response.organization);
    this.loadRegionLocalizationDropDowns();
    return Promise.resolve();
  }

  loadRegionLocalizationDropDowns() {
    let regionArray = this.organizationForm.controls.regions as FormArray;
    regionArray.controls.map((regionControl, index) => {
      this.getCantons(index);
      this.getDistricts(index);
      this.isAdded = this.isAdded + 1;
    });
  }

  getProvinces() {
    this.organizationService.getProvinces()
      .then(this.handleProvinces.bind(this))
      .catch((err) => observableThrowError(true));
  }

  handleProvinces(response: any) {
    this.regions.provinces = this.buildProvinces(response);
  }

  buildProvinces(provinces: any) {
    let provinceKeys = Object.keys(provinces);
    let buildProvinces = [];

    provinceKeys.map((key) => {
      let provinceBuilt = {
        id: provinces[key].id,
        name: provinces[key].name
      };

      buildProvinces.push(provinceBuilt);
    });

    return buildProvinces;
  }

  getCantons(index: number) {
    let regionsArray = this.organizationForm.controls.regions as FormArray;

    let provinceGroup = regionsArray.controls[index] as FormGroup;
    this.organizationService.getCantons(provinceGroup.value.province)
      .then((response: any) => {
        return Promise.all([response, index]);
      })
      .then(this.handleCantons.bind(this))
      .catch((err) => observableThrowError(true));
  }

  handleCantons(promises: any) {
    if (this.regions.cantons[promises[1]]) {
      this.regions.cantons[promises[1]] = this.buildCantons(promises[0]);
    } else {
      this.regions.cantons.push(this.buildCantons(promises[0]));
    }
  }

  buildCantons(cantons: any) {
    let cantonKeys = Object.keys(cantons);
    let buildCantons = [];

    cantonKeys.map((key) => {
      let cantonBuilt = {
        id: cantons[key].id,
        name: cantons[key].name
      };

      buildCantons.push(cantonBuilt);
    });

    return buildCantons;
  }

  getDistricts(index: number) {
    let regionsArray = this.organizationForm.controls.regions as FormArray;
    let regionGroup = regionsArray.controls[index] as FormGroup;
    this.organizationService.getDistricts(regionGroup.value.canton)
      .then((response: any) => {
        return Promise.all([response, index]);
      })
      .then(this.handleDistricts.bind(this))
      .catch((err) => observableThrowError(true));
  }

  handleDistricts(promises: any) {
    if (this.regions.districts[promises[1]]) {
      this.regions.districts[promises[1]] = this.buildDistricts(promises[0]);
    } else {
      this.regions.districts.push(this.buildDistricts(promises[0]));
    }
  }

  buildDistricts(districts: any) {
    let districtKeys = Object.keys(districts);
    let buildDistricts = [];
    districtKeys.map((key) => {
      let districtBuilt = {
        id: districts[key].id,
        name: districts[key].name
      };
      buildDistricts.push(districtBuilt);
    });
    return buildDistricts;
  }

  update(organization: any, isValid: boolean) {
    if (isValid) {
      const buildParameters = this.buildOrganizationParameters(organization);
      this.organizationService.putOrganization(buildParameters)
        .then(this.handleOrganizationCreated.bind(this))
        .catch(() => {
          this.notificationService.alertThis('No se ha podido modificar la información' , 'error' , () => {});
        });
    }
  }

  handleOrganizationCreated(response: any) {
    this.notificationService.alertThis('La información ha sido modificada correctamente' , 'success' , () => {
      this.formConfiguration();
      this.router.navigate(['/catalog/page-dashboard']);
    });
  }

  buildOrganizationParameters(organization: any) {
    const organizationBuilt = this.organizationService.organizationFormat(organization, this.organizationId);
    const regionBuilt = this.organizationService.regionFormat(organization);
    const legalPermissionBuilt = this.organizationService.legalPermissionFormat(organization);
    const addressBuilt = this.organizationService.addressFormat(organization);
    const buildOrganization = {
      organization: organizationBuilt,
      regions: regionBuilt,
      legalPermissions: legalPermissionBuilt,
      addresses: addressBuilt
    };
    return buildOrganization;
  }

  addRegion(formBuilder: FormBuilder, formGroup: FormGroup) {
    this.isAdded = this.isAdded + 1;
    this.organizationService.addRegionsField(this.formBuilder, this.organizationForm);
  }

  removeRegion(index: number, formGroup: FormGroup) {
    this.isAdded = this.isAdded - 1;
    this.organizationService.removeRegionsField(index, formGroup);
  }

  nextInfo() {
    this.next = this.next <= 3 ? this.next + 1 : this.next;
    this.showSubTitle();
  }

  prevInfo() {
    this.next = this.next > 0 ? this.next - 1 : this.next;
    this.showSubTitle();
  }

  showSubTitle() {
    if (this.next === 0) {
      this.info = 'Acerca de la Entidad';
    } else if (this.next === 1 || this.next === 2) {
      this.info = 'Información del Contacto';
    } else if (this.next === 3) {
      this.info = 'Horario de Atención';
    }
  }
}

export { OrganizationUpdateComponent }
