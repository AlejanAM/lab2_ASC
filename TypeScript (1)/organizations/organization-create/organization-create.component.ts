import {throwError as observableThrowError, Observable} from 'rxjs';
import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {OrganizationService} from '../organization.service';
import {SharedService} from '../../../shared/shared.service';
import {PageSuperUserService} from '../../pages/page-super-user/page-super-user.service';
import {ModalNotificationService} from '../../../utils/modal/notifications/modal-notifications.service';
import {CatalogNotificationService} from '../../../utils/modal/catalog-notification/catalog-notification.service';
import {CoreConstants} from '../../../core/core.constants';
import {BreadcrumbService} from '../../../shared/breadcrumb.service';

@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-create.component.html',
  styleUrls: ['./organization-create.component.scss'],
  providers: [OrganizationService, PageSuperUserService],
})
class OrganizationCreateComponent implements OnInit {
  public organizationForm: FormGroup;
  public showMessage: boolean;
  public isSuccessful: boolean;
  public organizationTypes: Array<any>;
  public provinces: Array<any>;
  public provinceKeys: any;
  public cantons: Array<any>;
  public cantonKeys: any;
  public districts: Array<any>;
  public districtKeys: any;
  public add: number;
  public info: string;
  public isCatalog: boolean;
  public roleUser: number;
  public usersList: any[];
  private id: string;
  private name: string;
  private email: string;
  private web: string;
  private telephone: string;
  private legalRepresentative: string;
  private assembly: string;
  private facebook: string;
  private twitter: string;
  private instagram: string;
  private wazeAddress: string;
  private schedule: string;
  private reaches: string;
  private objetives: string;
  private mision: string;
  private vision: string;
  private organizationSelected: number;
  private provinceSelected: string;
  private cantonSelected: string;
  private districtSelected: string;
  private monday: boolean;
  private tuesday: boolean;
  private wednesday: boolean;
  private thursday: boolean;
  private friday: boolean;
  private saturday: boolean;
  private sunday: boolean;
  private address: string;
  private legalPermissionName: string;
  private legalPermissionDescription: string;
  private legalPermissionDate: string;
  private userId: number;
  private regions: any;
  private next: number;
  private roleByEntity: number;
  private organizationRoles: any;
  public activateRoleByEntity: boolean;
  public invalidUser: boolean;
  public errors: any;
  public regionsErrors: any;
  public sectorsErrors: any;
  public legalPermissionsErrors: any;
  public catalogTypeOrg: boolean;

  @Input() isExternComponent: boolean;

  constructor(
    public sharedService: SharedService,
    private pageSuperUser: PageSuperUserService,
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private notificationService: ModalNotificationService,
    private errorNotification: CatalogNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.regions = {
      provinces: [],
      cantons: [],
      districts: [],
    };
    this.showMessage = false;
    this.isSuccessful = false;
    this.add = 0;
    this.info = 'Acerca de la Entidad';
    this.next = 0;
    this.isCatalog = false;
    this.roleByEntity = 0;
    this.activateRoleByEntity = false;
    this.organizationRoles = [];
    this.invalidUser = false;
    this.errors = [];
    this.regionsErrors = [];
    this.sectorsErrors = [];
    this.legalPermissionsErrors = [];
    this.catalogTypeOrg = false;
  }

  ngOnInit() {
    this.roleUser = Number(localStorage.getItem('rolId'));
    this.isCatalog =
      this.roleUser === CoreConstants.rolEditor ||
      this.roleUser === CoreConstants.rolAdministrator
        ? true
        : false;
    this.route.params.subscribe((params) => {
      this.userId = +params.userIdPk;
    });
    this.addBreadCrumb(this.userId);
    this.verifyIgedaModule();
    this.formConfiguration();
    this.validateRole(this.roleUser);
    this.loadOrganizationDependencies()
      .then(this.handleOrganizationDetail.bind(this))
      .catch((err) => observableThrowError(true));
  }

  /**
   * Add the routes for the breadcrumb array
   */
  addBreadCrumb(idUser) {
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/catalog/page-dashboard',
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Crear Entidades',
      href: `/#/catalog/page-dashboard/organizations/organization-create/${idUser}`,
    });
  }

  verifyIgedaModule() {
    if (this.isExternComponent) {
      this.getAllUsers();
    }
  }
  /**
   * Validates the role by id of the user and sets the roleByEntity based on the the type of user logged
   * @param idRole
   */
  validateRole(idRole) {
    switch (idRole) {
      case 2:
        this.roleByEntity = 1;
        break;
      case 10:
        this.activateRoleByEntity = true;
        this.organizationForm.addControl(
          'organizationRoles',
          new FormControl('', [Validators.required]),
        );
        this.getOrganizationRoles();
        break;
      case 6:
        this.roleByEntity = 2;
        break;
      default:
        break;
    }
  }

  /**
   * Gets all the users
   */
  getAllUsers() {
    this.pageSuperUser.getAllUsers().then(this.handleUsers.bind(this));
  }

  /**
   * Gets all the roles of the organizations
   */
  getOrganizationRoles() {
    this.pageSuperUser.getAllOrganizationsRoles().then((result) => {
      this.organizationRoles = result;
    });
  }

  handleUsers(response: any) {
    this.usersList = response;
  }

  getWizardClassName() {
    let className = 'catalog-wizard';
    if (!this.isCatalog) {
      className = 'ong-wizard';
    }
    return className;
  }

  /**
   * Form config
   */
  formConfiguration() {
    this.organizationForm = this.formBuilder.group({
      dni: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/),
        ],
      ],
      web: ['', Validators.maxLength(250)],
      telephone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)],
      ],
      legalRepresentative: ['', [Validators.required]],
      legalRepresentativeSICID: [''],
      assemblies: this.formBuilder.array([
        this.organizationService.initAssemblyField(this.formBuilder),
      ]),
      socialNetworks: this.formBuilder.group({
        twitter: [''],
        facebook: [''],
        instagram: [''],
        whatsapp: [''],
      }),
      wazeAddresses: this.formBuilder.array([
        this.organizationService.initWazeAddressField(this.formBuilder),
      ]),
      schedule: [
        'Remove (Useless)',
        [Validators.required, Validators.maxLength(100)],
      ],
      reaches: [''],
      mision: ['', Validators.required],
      vision: ['', Validators.required],
      objective: ['', Validators.required],
      organizationType: ['', Validators.required],
      regions: this.formBuilder.array([
        this.organizationService.initRegionField(this.formBuilder),
      ]),
      daysToOperation: this.formBuilder.group({
        monday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: [''],
        }),
        tuesday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: [''],
        }),
        wednesday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: [''],
        }),
        thursday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: [''],
        }),
        friday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: [''],
        }),
        saturday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: [''],
        }),
        sunday: this.formBuilder.group({
          available: [false],
          begin: [''],
          end: [''],
          typeBegin: [''],
          typeEnd: [''],
        }),
      }),
      legalPermissions: this.formBuilder.array([
        this.organizationService.initLegalPermissionField(this.formBuilder),
      ]),
      sectors: this.formBuilder.array([
        this.organizationService.initSectorField(this.formBuilder),
      ]),
    });
  }

  handleOrganizationType(response: any) {
    this.organizationTypes = response.names;
  }

  handleOrganizationDetail(response: any) {
    return Promise.resolve();
  }

  changeEntityRole(value) {
    this.roleByEntity = Number(value);
  }

  loadRegionLocalizationDropDowns() {
    let regionArray = this.organizationForm.controls.regions as FormArray;
    regionArray.controls.map((regionControl, index) => {
      this.getCantons(index);
      this.getDistricts(index);
    });
  }

  loadOrganizationDependencies() {
    this.getProvinces();
    return this.organizationService
      .getOrganizationstype()
      .then(this.handleOrganizationType.bind(this))
      .catch((err) => observableThrowError(true));
  }

  handleOrganizationCreated(response: any) {
    this.validateOrganizationType(response);
    this.notificationService.alertThis(
      'La información ha sido registrada correctamente',
      'success',
      () => {
        this.formConfiguration();
        if (this.isExternComponent) {
          if (this.roleUser === CoreConstants.rolAdministratorIGEDA) {
            this.router.navigate(['/igeda/admin']).then(() => {
              window.location.reload();
            });
          } else if (this.roleUser === CoreConstants.rolSuperUser) {
            this.router.navigate(['/catalog/principal-page-super-user']);
          }
        } else {
          this.router.navigate(['/catalog/page-dashboard']);
        }
      },
    );
  }

  catchOrganizationCreated(err: any) {
    this.notificationService.alertThis(
      'No se ha podido registrar la información',
      'error',
      () => {},
    );
  }

  /**
   * Validates the user credencials are valid
   */
  validateCredencials() {
    let control;
    let requiredCounter = 0;
    requiredCounter += this.validateSectorsErrors();
    requiredCounter += this.validateRegionsErrors();
    requiredCounter += this.validateLegalPermissionsErrors();
    let invalidCounter = 0;
    let validUser = true;
    // tslint:disable-next-line: forin
    for (const formControl in this.organizationForm.controls) {
      control = this.organizationForm.get(formControl);
      if (control.errors) {
        validUser = false;
        if (control.errors.required) {
          this.errors.push({
            control: formControl,
            error: 'required',
          });
          requiredCounter++;
        }
        if (control.errors.pattern) {
          invalidCounter++;
          this.errors.push({
            control: formControl,
            error: 'pattern',
          });
        }
        if (control.errors.maxlength) {
          invalidCounter++;
          this.errors.push({
            control: formControl,
            error: 'maxLength',
          });
        }
      }
    }
    if (!validUser) {
      this.errorNotification.alertThis(
        `${invalidCounter},${requiredCounter}`,
        'error',
        () => {
          this.invalidUser = true;
        },
      );
    }
  }

  /**
   * Validates if the region credencials are valid
   */
  validateRegionsErrors() {
    let errorCounter = 0;
    let control;
    const regions = this.sharedService.getControls(
      this.organizationForm,
      'regions',
    );
    // tslint:disable-next-line: forin
    for (const formControl in regions) {
      control = this.organizationForm.controls.regions.get(formControl);
      if (control.controls.province.invalid) {
        this.regionsErrors.push({
          control: 'province',
          index: formControl,
        });
        errorCounter++;
      }
      if (control.controls.canton.invalid) {
        errorCounter++;
        this.regionsErrors.push({
          control: 'canton',
          index: formControl,
        });
      }
      if (control.controls.district.invalid) {
        errorCounter++;
        this.regionsErrors.push({
          control: 'district',
          index: formControl,
        });
      }
    }
    return errorCounter;
  }

  /**
   * Validates if the sectors credencials are valid
   */
  validateSectorsErrors() {
    let errorCounter = 0;
    let control;
    const regions = this.sharedService.getControls(
      this.organizationForm,
      'sectors',
    );
    // tslint:disable-next-line: forin
    for (const formControl in regions) {
      control = this.organizationForm.controls.sectors.get(formControl);
      if (control.controls.address.invalid) {
        this.sectorsErrors.push({
          control: 'address',
          index: formControl,
        });
        errorCounter++;
      }
    }
    return errorCounter;
  }

  /**
   * Validates if the region credencials are valid
   */
  validateLegalPermissionsErrors() {
    let errorCounter = 0;
    let control;
    const legalPermissions = this.sharedService.getControls(
      this.organizationForm,
      'legalPermissions',
    );
    // tslint:disable-next-line: forin
    for (const formControl in legalPermissions) {
      control = this.organizationForm.controls.legalPermissions.get(
        formControl,
      );
      if (control.controls.name.invalid) {
        this.legalPermissionsErrors.push({
          control: 'name',
          index: formControl,
        });
        errorCounter++;
      }
      if (control.controls.description.invalid) {
        errorCounter++;
        this.legalPermissionsErrors.push({
          control: 'description',
          index: formControl,
        });
      }
      if (control.controls.expirationDate.invalid) {
        errorCounter++;
        this.legalPermissionsErrors.push({
          control: 'expirationDate',
          index: formControl,
        });
      }
    }
    return errorCounter;
  }

  /**
   * Validates if the catalog editor its creating an organization with a type of ONG
   * @param orgType
   */
  validateOrganizationType(orgResponse) {
    const organization = orgResponse.phrase;
    if (organization.organizationsTypesidPk === 1 && this.roleUser === 2) {
      this.createOrganizationByOrganizationRole(organization);
    }
  }

  /**
   * Creates the bind between and org and a role organization
   * @param idOrg
   */
  createOrganizationByOrganizationRole(response) {
    this.organizationService.postOrganizationOrganizationRole(response.idPk, 2);
  }

  /**
   * Saves the new organization
   * @param organization
   * @param isValid
   */
  save(organization: any, isValid: boolean) {
    this.invalidUser = false;
    this.errors = [];
    this.regionsErrors = [];
    this.sectorsErrors = [];
    this.legalPermissionsErrors = [];
    const organizationBuilt = this.organizationService.organizationFormat(
      organization,
      null,
      this.isExternComponent,
    );
    const regionBuilt = this.organizationService.regionFormat(organization);
    const legalPermissionBuilt = this.organizationService.legalPermissionFormat(
      organization,
    );
    const addressBuilt = this.organizationService.addressFormat(organization);
    if (isValid) {
      if (!this.isExternComponent) {
        this.organizationService
          .createOrganization(
            organizationBuilt,
            regionBuilt,
            legalPermissionBuilt,
            addressBuilt,
            this.userId,
            this.roleByEntity,
          )
          .then(this.handleOrganizationCreated.bind(this))
          .catch(this.catchOrganizationCreated.bind(this));
      } else {
        this.organizationService
          .createOrganization(
            organizationBuilt,
            regionBuilt,
            legalPermissionBuilt,
            addressBuilt,
            +this.organizationForm.controls.legalRepresentativeSICID.value,
            this.roleByEntity,
          )
          .then(this.handleOrganizationCreated.bind(this))
          .catch(this.catchOrganizationCreated.bind(this));
      }
    } else {
      this.validateCredencials();
    }
  }

  addRegion(formBuilder: FormBuilder, formGroup: FormGroup) {
    this.add = this.add + 1;
    this.organizationService.addRegionsField(
      this.formBuilder,
      this.organizationForm,
    );
  }

  removeRegion(index: number, formGroup: FormGroup) {
    this.add = this.add - 1;
    this.organizationService.removeRegionsField(index, formGroup);
  }

  getProvinces() {
    this.organizationService
      .getProvinces()
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
        name: provinces[key].name,
      };

      buildProvinces.push(provinceBuilt);
    });

    return buildProvinces;
  }

  getCantons(index: number) {
    let regionsArray = this.organizationForm.controls.regions as FormArray;
    let provinceGroup = regionsArray.controls[index] as FormGroup;
    this.organizationService
      .getCantons(provinceGroup.value.province)
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
        name: cantons[key].name,
      };

      buildCantons.push(cantonBuilt);
    });

    return buildCantons;
  }

  getDistricts(index: number) {
    let regionsArray = this.organizationForm.controls.regions as FormArray;
    let regionGroup = regionsArray.controls[index] as FormGroup;
    this.organizationService
      .getDistricts(regionGroup.value.canton)
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
        name: districts[key].name,
      };

      buildDistricts.push(districtBuilt);
    });

    return buildDistricts;
  }

  showSubTitle() {
    if (this.next === 0) {
      this.info = 'Acerca de la Entidad';
    } else if (this.next === 1) {
      this.info = 'Información del Contacto';
    } else if (this.next === 2) {
      this.info = 'Horario de Atención';
    }
  }

  nextInfo() {
    this.next = this.next <= 3 ? this.next + 1 : this.next;
    this.showSubTitle();
  }

  prevInfo() {
    this.next = this.next > 0 ? this.next - 1 : this.next;
    this.showSubTitle();
  }
}
export {OrganizationCreateComponent};
