import {Component, OnInit, Inject} from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {TypeAttentionService} from '../../../../type-attention/type-attention.service';
import {SectorService} from '../../../../sector/sector.service';
import {ServiceService} from '../../service/service.service';
import {LegalPermissionService} from '../../../../legal-permission/legal-permission.service';
import {AddressService} from '../../../../address/address.service';
import {ItemsService} from '../../../items.service';
import {ItemService} from '../../item.service';
import {CoreConstants} from '../../../../../core/core.constants';
import {SharedService} from '../../../../../shared/shared.service';
import {ModalNotificationService} from '../../../../../utils/modal/notifications/modal-notifications.service';
import {CatalogNotificationService} from '../../../../../utils/modal/catalog-notification/catalog-notification.service';
import {ICatalogConfig, CATALOG_CONFIG} from '../../../../catalog.config';
import {ProductService} from '../../product/product.service';
import {BreadcrumbService} from '../../../../../shared/breadcrumb.service';
import {ITEM_RANGE_COST_ERRORS} from '../../item.constants'

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: [
    './service-create.component.scss',
    '../../../../common/styles/style.scss',
  ],
  providers: [
    ItemService,
    ItemsService,
    ProductService,
    TypeAttentionService,
    SectorService,
    CoreConstants,
    ServiceService,
    LegalPermissionService,
    AddressService,
  ],
})
class ServiceCreateComponent implements OnInit {
  public serviceForm: FormGroup;
  public submitted: boolean;
  public showMessage: boolean;
  public isSuccessful: boolean;
  public isFormValid: boolean;
  public disableButton: boolean;
  public disableNext: boolean;
  public typesAttention: any;
  public legalPermissions: any;
  public addresses: any;
  public sectors: any;
  public dropDownElements: any;
  public legalPermissionDropDown: any;
  public addressDropDown: any;
  public typeAttentionDropDown: any;
  public typeAttentionExtraDropDown: any;
  public sectorDropDown: any;
  public organizations: any;
  public add: number;
  public info: string;
  private userId: number;
  private next: number;
  private image1Name: string;
  private image2Name: string;
  private image3Name: string;
  private itemFile1: any;
  private itemFile2: any;
  private itemFile3: any;
  public rangeCost: boolean;
  public costError: string;
  public validName: boolean;
  public validOrg: boolean;
  public validStartCost: boolean;
  public validEndCost: boolean;

  constructor(
    @Inject(CATALOG_CONFIG) private config: ICatalogConfig,
    private formBuilder: FormBuilder,
    public itemService: ItemService,
    public serviceService: ServiceService,
    private productService: ProductService,
    public sharedService: SharedService,
    private notificationService: ModalNotificationService,
    private catalogNotification: CatalogNotificationService,
    private itemsService: ItemsService,
    private typeAttentionService: TypeAttentionService,
    private sectorService: SectorService,
    private legalPermissionService: LegalPermissionService,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.showMessage = false;
    this.isSuccessful = false;
    this.isFormValid = true;
    this.disableButton = false;
    this.disableNext = true;
    this.typesAttention = [];
    this.sectors = [];
    this.legalPermissions = [];
    this.addresses = [];
    this.showMessage = false;
    this.isSuccessful = false;
    this.legalPermissionDropDown = {};
    this.addressDropDown = {};
    this.typeAttentionDropDown = {};
    this.typeAttentionExtraDropDown = {};
    this.sectorDropDown = {};
    this.dropDownElements = [];
    this.info = 'Información General del Servicio';
    this.next = 0;
    this.add = 0;
    this.rangeCost = false;
    this.validName = true;
    this.validOrg = true;
    this.costError = '';
    this.validStartCost = true;
    this.validEndCost = true;
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params.userIdPk;
    this.addBreadCrumb(this.userId);
    this.loadTypesAttentionExtra();
    this.loadSectors();
    this.formConfiguration();
    this.itemService
      .getOrganization(this.userId)
      .then(this.handleOrganizations.bind(this))
      .catch((err: any) => err);
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
      page: 'Crear Servicio',
      href: `/#/catalog/page-dashboard/item/create-service/${idUser}`,
    });
  }

  formConfiguration() {
    this.serviceForm = this.formBuilder.group({
      code: [''],
      name: ['', [Validators.required]],
      organization: ['', Validators.required],
      description: [''],
      observations: [''],
      image1: [''],
      image2: [''],
      image3: [''],
      itemFile1: [''],
      itemFile2: [''],
      itemFile3: [''],
      visibility: [true],
      isProduct: [false],
      daysToOperation: this.formBuilder.group({
        monday: [false],
        tuesday: [false],
        wednesday: [false],
        thursday: [false],
        friday: [false],
        saturday: [false],
        sunday: [false],
      }),
      typeDeficiency: [''],
      ages: this.formBuilder.array([
        this.itemService.initAgeField(this.formBuilder),
      ]),
      sex: [2],
      isForPregnant: [2],
      cost: [''],
      startCost: [
        {value: '', disabled: true},
        [Validators.maxLength(50), Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)],
      ],
      endCost: [
        {value: '', disabled: true},
        [Validators.maxLength(50), Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)],
      ],
      isPrivate: [true],
      objective: [''],
      reach: [''],
      specificSupport: [''],
      typeSupport: [0],
      responsability: [''],
      cover: [0],
      requirement: [''],
      accessibility: [''],
      other: [''],
      serviceDaysToOperation: this.formBuilder.group({
        monday: [false],
        tuesday: [false],
        wednesday: [false],
        thursday: [false],
        friday: [false],
        saturday: [false],
        sunday: [false],
      }),
      hasScheduleExtra: [true],
      otherExtra: [''],
      legalPermissions: this.formBuilder.array([
        this.itemService.initLegalPermissionsField(this.formBuilder),
      ]),
      addresses: this.formBuilder.array([
        this.itemService.initAddressesField(this.formBuilder),
      ]),
      typesAttention: this.formBuilder.array([
        this.itemService.initTypesAttentionField(this.formBuilder),
      ]),
      certificates: this.formBuilder.array([
        this.itemService.initCertificatesField(this.formBuilder),
      ]),
      typesAttentionExtra: this.formBuilder.array([
        this.initTypesAttentionExtraField(),
      ]),
      sectors: this.formBuilder.array([this.initSectorsField()]),
      attentionFrecuency: this.formBuilder.array([
        this.initFrequencyExtraAttentions(),
      ]),
    });
  }

  /**
   * Toggles between enabling the cost input or the ranges cost inputs
   */
  toggleRangeCost() {
    if (this.rangeCost) {
      this.rangeCost = false;
      this.serviceForm.controls.cost.enable();
      this.serviceForm.controls.startCost.disable();
      this.serviceForm.controls.startCost.setValue('');
      this.serviceForm.controls.endCost.disable();
      this.serviceForm.controls.endCost.setValue('');
    } else {
      this.rangeCost = true;
      this.serviceForm.controls.cost.disable();
      this.serviceForm.controls.cost.setValue('');
      this.serviceForm.controls.startCost.enable();
      this.serviceForm.controls.endCost.enable();
    }
  }

  selectOrganization() {
    this.disableNext = false;
    this.loadLegalPermissions(this.serviceForm.controls.organization.value);
    this.loadAddresses(this.serviceForm.controls.organization.value);
  }

  handleOrganizations(response: any) {
    this.organizations = response.organizations;
  }

  initSectorsField() {
    const sectorElement = this.formBuilder.group({
      sector: [''],
    });
    return sectorElement;
  }

  initTypesAttentionExtraField() {
    const typesAttentionExtraElement = this.formBuilder.group({
      typeAttentionExtra: [''],
    });
    return typesAttentionExtraElement;
  }

  initFrequencyExtraAttentions() {
    const frequencyExtraAttentionsElement = this.formBuilder.group({
      attentionFrecuency: [''],
    });
    return frequencyExtraAttentionsElement;
  }

  addTypeAtentionExtraField() {
    const element = <FormArray>this.serviceForm.controls.typesAttentionExtra;
    if (
      element.length !== this.typesAttention.length &&
      this.typesAttention.length !== 0
    ) {
      element.push(this.initTypesAttentionExtraField());
    }
  }

  removeTypeAttentionExtraField(index: number) {
    const element = <FormArray>this.serviceForm.controls.typesAttentionExtra;
    element.removeAt(index);
  }

  addSectorField() {
    const element = <FormArray>this.serviceForm.controls.sectors;
    if (element.length !== this.sectors.length && this.sectors.length !== 0) {
      element.push(this.initSectorsField());
    }
  }

  removeSectorField(index: number) {
    const element = <FormArray>this.serviceForm.controls.sectors;
    element.removeAt(index);
  }

  addFrequencyExtraAttentionField() {
    const element = <FormArray>this.serviceForm.controls.attentionFrecuency;
    element.push(this.initFrequencyExtraAttentions());
  }

  removeFrequencyExtraAttentionField(index: number) {
    const element = <FormArray>this.serviceForm.controls.attentionFrecuency;
    element.removeAt(index);
  }

  /**
   * Sets the name of the file based on the input selected and sets the its name to the control value
   * @param $event
   * @param type
   */
  onChangeImageFile($event: any, type: number) {
    // tslint:disable-line
    let reader = new FileReader();
    let file = $event.target.files[0];

    reader.onload = () => {
      if (type === 1) {
        this.serviceForm.controls.image1.setValue(reader.result);
        this.image1Name = file.name;
      } else if (type === 2) {
        this.serviceForm.controls.image2.setValue(reader.result);
        this.image2Name = file.name;
      } else if (type === 3) {
        this.serviceForm.controls.image3.setValue(reader.result);
        this.image3Name = file.name;
      }
    };
    reader.readAsDataURL(file);
  }

  /**
   * Sets the name of the file based on the input selected and sets the its name to the control value
   * @param $event
   * @param type
   */
  onChangeDataSheetFile($event: any, type: number) {
    // tslint:disable-line
    let reader = new FileReader();
    let file = $event.target.files[0];

    reader.onload = () => {
      switch (type) {
        case 1:
          this.itemFile1 = this.changeNameToFile(file, 1);
          this.serviceForm.controls.itemFile1.setValue(reader.result);
          break;
        case 2:
          this.itemFile2 = this.changeNameToFile(file, 1);
          this.serviceForm.controls.itemFile2.setValue(reader.result);
          break;
        case 3:
          this.itemFile3 = this.changeNameToFile(file, 1);
          this.serviceForm.controls.itemFile3.setValue(reader.result);
          break;
        default:
          break;
      }
    };
    reader.readAsDataURL(file);
  }

  /**
   * Updates the name of a file element
   * @param fileToUpload
   * @param index
   */
  changeNameToFile(fileToUpload: File, index: number) {
    let blob = fileToUpload.slice(0, fileToUpload.size, fileToUpload.type);
    return new File([blob], fileToUpload.name, {type: fileToUpload.type});
  }

  /**
   * validates if the item got any name added to them if they have then post them
   */
  private validateFiles() {
    if (this.itemFile1 !== undefined) {
      this.postFile(this.itemFile1);
    }
    if (this.itemFile2 !== undefined) {
      this.postFile(this.itemFile2);
    }
    if (this.itemFile3 !== undefined) {
      this.postFile(this.itemFile3);
    }
  }

  /**
   * Post the file element into the designate container
   * @param itemFile
   */
  private postFile(itemFile) {
    this.productService.postFile(itemFile, 'servicesFiles').then();
  }

  /**
   * Sets the service format
   * @param productSource
   */
  serviceFormat(service: any) {
    const format = {
      idPk: '',
      isPrivate: service.isPrivate,
      cost: service.cost ? service.cost : '',
      objectives: service.objective ? service.objective : '',
      reaches: service.reach ? service.reach : '',
      specificSupports: service.specificSupport ? service.specificSupport : '',
      typeSupports: service.typeSupport ? service.typeSupport : '',
      daysToOperations: this.itemService.convertDayOperationToArray(
        service.daysToOperation,
      ),
      responsabilityPerson: service.responsability
        ? service.responsability
        : '',
      cover: service.cover ? service.cover : '',
      requirements: service.requirement ? service.requirement : '',
      accesibility: service.accessibility ? service.accessibility : '',
      others: service.other ? service.other : '',
      scheduleExtraordinary: service.hasScheduleExtra,
      otherExtraordinaryAttention: service.otherExtra ? service.otherExtra : '',
      overtime: this.itemService.convertDayOperationToArray(
        service.serviceDaysToOperation,
      ),
    };
    return format;
  }

  sectorFormat(sectors: any) {
    const sectorsObj = {
      serviceSectors: sectors,
    };
    return sectorsObj;
  }

  typeAttentionExtraFormat(typesAttentionExtra: any) {
    const typeAttentionExtraObj = {
      itemTypesAttentionExtra: typesAttentionExtra,
    };
    return typeAttentionExtraObj;
  }

  frequencyExtraAttentionsFormat(frequencyExtraAttentions) {
    const extraAttentionsFrequency = {
      extraAttentionsFrequency: frequencyExtraAttentions,
    };
    return extraAttentionsFrequency;
  }

  private setSectorFormat(service: any) {
    const sectorValue =
      service.sectors[0].sector !== ''
        ? service.sectors
        : this.config.SECTOR_DEFAULT_VALUE;
    return this.sectorFormat(sectorValue);
  }

  private setTypeAttentionExtraFormat(service: any) {
    const typeAttentionExtraValue =
      service.typesAttentionExtra[0].typeAttentionExtra !== ''
        ? service.typesAttentionExtra
        : this.config.TYPE_ATTENTION_EXTRA_DEFAULT_VALUE;
    return this.typeAttentionExtraFormat(typeAttentionExtraValue);
  }

  private setFrequencyExtraAttentions(service: any) {
    const frequencyAttentionExtra =
      service.attentionFrecuency[0].attentionFrecuency !== ''
        ? service.attentionFrecuency
        : this.config.TYPE_FREQUENCY_ATTENTION_DEFAULT_VALUE;
    return this.frequencyExtraAttentionsFormat(frequencyAttentionExtra);
  }

  private setOrganizationAndItemFormat(service: any) {
    let obj = {
      item: null,
      organization: null,
    };
    const organizationValue = this.serviceForm.controls.organization.value
      ? this.serviceForm.controls.organization.value
      : this.config.ORGANIZATION_DEFAULT_VALUE;
    const imgSrc = service.image1 ? service.image1 : this.config.IMG_SRC;
    service.image1 = imgSrc;
    service.image1Name = this.image1Name;
    service.image2Name = this.image2Name;
    service.image3Name = this.image3Name;
    service.itemFile1 = this.itemFile1 !== undefined ? this.itemFile1.name : '';
    service.itemFile2 = this.itemFile2 !== undefined ? this.itemFile2.name : '';
    service.itemFile3 = this.itemFile3 !== undefined ? this.itemFile3.name : '';
    obj.item = this.itemService.itemFormat(service, organizationValue, null);
    obj.organization = this.itemService.organizationFormat(organizationValue);
    return obj;
  }

  private setLegalPermissionsFormat(service: any) {
    const legalPermissionValue =
      service.legalPermissions[0].legalPermission !== ''
        ? service.legalPermissions
        : this.config.LEGAL_PERMISSION_DEFAULT_VALUE;
    return this.itemService.legalPermissionFormat(legalPermissionValue);
  }

  private setTypeAttentionFormat(service: any) {
    const typeAttentionValue =
      service.typesAttention[0].typeAttention !== ''
        ? service.typesAttention
        : this.config.TYPE_ATTENTION_DEFAULT_VALUE;
    return this.itemService.typeAttentionFormat(typeAttentionValue);
  }

  private setAddressFormat(service: any) {
    const addressValue =
      service.addresses[0].address !== ''
        ? service.addresses
        : this.config.ADDRESS_DEFAULT_VALUE;
    return this.itemService.addressFormat(addressValue);
  }

  private setCertificateFormat(service: any) {
    const certificateValue = service.certificates;
    return this.itemService.certificateFormat(certificateValue);
  }

  /**
   * builds the service element and call all the format functions
   * @param service
   */
  buildServiceParamters(service: any) {
    const {item, organization} = this.setOrganizationAndItemFormat(service);
    const buildProduct = {
      organization: organization,
      addresses: this.setAddressFormat(service),
      typesAttention: this.setTypeAttentionFormat(service),
      typesAttentionExtra: this.setTypeAttentionExtraFormat(service),
      frequencyExtraAttentions: this.setFrequencyExtraAttentions(service),
      legalPermissions: this.setLegalPermissionsFormat(service),
      item: item,
      certificates: this.setCertificateFormat(service),
      service: this.serviceFormat(service),
      sectors: this.setSectorFormat(service),
    };
    return buildProduct;
  }

  /**
   * creates a new service
   * @param service
   * @param isValid
   */
  save(service: any, isValid: boolean) {
    this.validName = true;
    this.validOrg = true;
    this.validStartCost = true;
    this.validEndCost = true;
    this.costError = "";
    if (isValid) {
      if (this.validateNotification(service)) {
        const buildParameters = this.buildServiceParamters(service);
        this.serviceService
          .postService(buildParameters)
          .then(this.handleServiceCreated.bind(this))
          .catch(() => {
            this.notificationService.alertThis(
              'No se ha podido registrar la información',
              'error',
              () => {},
            );
          });
      }
    } else {
      this.validateNotification(service);
    }
  }

  /**
   * Validate function for inputs errors o required errors
   * @param service
   */
  validateNotification(service) {
    let errorInputs = 0;
    let requiredInputs = 0;
    let validService = true;
    if (service.startCost != undefined && service.endCost != undefined) {
      errorInputs = this.validateRangeCost(service.startCost, service.endCost);
      if (errorInputs > 0) {
        validService = false;
      }
    }
    if (service.name === '') {
      requiredInputs++;
      this.validName = false;
      validService = false;
    }
    if (service.organization === '') {
      requiredInputs++;
      this.validOrg = false;
      validService = false;
    }
    if (!validService) {
      this.catalogNotification.alertThis(
        `${errorInputs},${requiredInputs}`,
        'error',
        () => {},
      );
    }
    return validService;
  }

  /**
   * Shows a success messages and algo validates the new files
   * @param response
   */
  handleServiceCreated(response: any) {
    this.validateFiles();
    this.notificationService.alertThis(
      'La información ha sido registrada correctamente',
      'success',
      () => {
        this.router.navigate(['/catalog/page-dashboard']);
      },
    );
  }

  /**
   * Validates the cost of the product if the range cost was active
   * @param startCost
   * @param endCost
   */
  validateRangeCost(startCost, endCost) {
    let errorCounter = 0;
    if(this.serviceForm.controls.startCost.errors) {
      this.validStartCost = false;
      errorCounter++;
    }
    if(this.serviceForm.controls.endCost.errors) {
      this.validEndCost = false;     
      errorCounter++; 
    }
    if(this.validStartCost && this.validEndCost) {
      if (Number(startCost) > Number(endCost)) {
        errorCounter++;
        this.costError = ITEM_RANGE_COST_ERRORS[0];
      }
      if (Number(startCost) == Number(endCost)) {
        errorCounter++;
        this.costError = ITEM_RANGE_COST_ERRORS[1];
      }
      if (Number(startCost) <= 0 || Number(endCost) <= 0) {
        errorCounter++;
        this.costError = ITEM_RANGE_COST_ERRORS[2];
      }
    }
    return errorCounter;
  }

  loadTypesAttentionExtra() {
    this.typeAttentionService
      .getTypesAttention(CoreConstants.IS_PRODUCT)
      .then(this.handleTypesAttentionExtraLoaded.bind(this))
      .catch(this.catchTypesAttentionExtra);
  }

  handleTypesAttentionExtraLoaded(response: any) {
    if (response.typesAttention.length) {
      this.typeAttentionExtraDropDown = {
        isValid: true,
        name: 'typeAttentionExtra',
      };
      this.typeAttentionDropDown = {
        isValid: true,
        name: 'typeAttention',
      };
      this.dropDownElements.push(this.typeAttentionDropDown);
      this.dropDownElements.push(this.typeAttentionExtraDropDown);
      response.typesAttention.map((typeAttention) => {
        this.typesAttention.push(typeAttention);
      });
    }
  }

  catchTypesAttentionExtra() {
    console.log('Error...');
  }

  loadLegalPermissions(organizationId: number) {
    this.legalPermissionService
      .getLegalPermissions(organizationId)
      .then(this.handleLegalPermissionsLoaded.bind(this))
      .catch(this.catchLegalPermissions);
  }

  handleLegalPermissionsLoaded(response: any) {
    if (response.legalPermissions.length) {
      this.legalPermissionDropDown = {
        isValid: true,
        name: 'legalPermission',
      };
      this.dropDownElements.push(this.legalPermissionDropDown);
      response.legalPermissions.map((legalPermission) => {
        this.legalPermissions.push(legalPermission);
      });
    }
  }

  catchLegalPermissions() {
    console.log('Error...');
  }

  loadAddresses(organizationId: number) {
    this.addressService
      .getAddressesByOrganizationId(organizationId)
      .then(this.handleAddressesLoaded.bind(this))
      .catch(this.catchAddresses);
  }

  handleAddressesLoaded(addresses: any) {
    if (addresses.address.length) {
      this.addressDropDown = {
        isValid: true,
        name: 'address',
      };
      this.dropDownElements.push(this.addressDropDown);
      addresses.address.map((address) => {
        this.addresses.push(address);
      });
    }
  }

  catchAddresses() {
    console.log('Error...');
  }

  loadSectors() {
    this.sectorService
      .getSectors()
      .then(this.handleSectorsLoaded.bind(this))
      .catch(this.catchSectors);
  }

  handleSectorsLoaded(sectors: any) {
    if (sectors.length) {
      this.sectorDropDown = {
        isValid: true,
        name: 'sector',
      };
      this.dropDownElements.push(this.sectorDropDown);
      sectors.map((sector) => {
        this.sectors.push(sector);
      });
    }
  }

  catchSectors() {
    console.log('Error...');
  }

  onChangeDropDownValidation(formGroupName: string, controlName: string) {
    this.isFormValid = this.itemService.warningElementNotAllow(
      this.dropDownElements,
      this.serviceForm,
      formGroupName,
      controlName,
    );
  }

  showSubTitle() {
    if (this.next === 0) {
      this.info = 'Información General del Servicio';
    } else if (this.next === 1) {
      this.info = 'Características del Servicio';
    } else if (this.next === 2) {
      this.info = 'Disponibilidad del Servicio';
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
export {ServiceCreateComponent};
