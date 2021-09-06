import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {TypeAttentionService} from '../../../../type-attention/type-attention.service';
import {SectorService} from '../../../../sector/sector.service';
import {ServiceService} from '../../service/service.service';
import {LegalPermissionService} from '../../../../legal-permission/legal-permission.service';
import {AddressService} from '../../../../address/address.service';
import {ItemService} from '../../item.service';
import {CoreConstants} from '../../../../../core/core.constants';
import {OrganizationService} from '../../../../organizations/organization.service';
import {SharedService} from '../../../../../shared/shared.service';
import {ModalNotificationService} from '../../../../../utils/modal/notifications/modal-notifications.service';
import {CatalogNotificationService} from '../../../../../utils/modal/catalog-notification/catalog-notification.service';
import {ICatalogConfig, CATALOG_CONFIG} from '../../../../catalog.config';
import {ProductService} from '../../product/product.service';
import {BreadcrumbService} from '../../../../../shared/breadcrumb.service';
import {ITEM_RANGE_COST_ERRORS} from '../../item.constants'

@Component({
  selector: 'app-service-update',
  templateUrl: './service-update.component.html',
  styleUrls: [
    './service-update.component.scss',
    '../../../../common/styles/style.scss',
  ],
  providers: [
    TypeAttentionService,
    SectorService,
    ProductService,
    CoreConstants,
    ServiceService,
    OrganizationService,
    LegalPermissionService,
    AddressService,
  ],
})
class ServiceUpdateComponent implements OnInit {
  public serviceForm: FormGroup;
  public submitted: boolean;
  public showMessage: boolean;
  public isSuccessful: boolean;
  public isFormValid: boolean;
  public disableButton: boolean;
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
  public divisionName: any;
  public organization: any;
  public info: string;
  public next: number;
  public item: any;
  public service: any;
  public organizationId: number;
  public userId: number;
  public image1Name: string;
  public image2Name: string;
  public image3Name: string;
  public itemFile1: any;
  public itemFile2: any;
  public itemFile3: any;
  public editedFile1: boolean;
  public editedFile2: boolean;
  public editedFile3: boolean;
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
    public sharedService: SharedService,
    private organizationService: OrganizationService,
    private notificationService: ModalNotificationService,
    private catalogNotification: CatalogNotificationService,
    private typeAttentionService: TypeAttentionService,
    private sectorService: SectorService,
    private serviceService: ServiceService,
    private productService: ProductService,
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
    this.itemFile1 = {};
    this.itemFile2 = {};
    this.itemFile3 = {};
    this.editedFile1 = false;
    this.editedFile2 = false;
    this.editedFile3 = false;
    this.typesAttention = [];
    this.sectors = [];
    this.legalPermissions = [];
    this.addresses = [];
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
    this.organizationId = this.route.snapshot.params.organizationId;
    this.formConfiguration();
    this.loadService();
  }

  formConfiguration() {
    this.serviceForm = this.formBuilder.group({
      code: [''],
      name: ['', [Validators.required]],
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
      ages: this.formBuilder.array([]),
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
      legalPermissions: this.formBuilder.array([]),
      addresses: this.formBuilder.array([]),
      typesAttention: this.formBuilder.array([]),
      certificates: this.formBuilder.array([]),
      typesAttentionExtra: this.formBuilder.array([]),
      sectors: this.formBuilder.array([]),
      attentionFrecuency: this.formBuilder.array([]),
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

  /**
   * Initializes the sects control
   */
  initSectorsField() {
    const sectorElement = this.formBuilder.group({
      sector: [''],
    });
    return sectorElement;
  }

  /**
   * Initializes the attention extra control
   */
  initTypesAttentionExtraField() {
    const typesAttentionExtraElement = this.formBuilder.group({
      typeAttentionExtra: [''],
    });
    return typesAttentionExtraElement;
  }

  /**
   * Initializes the extra attencions control
   */
  initFrequencyExtraAttentions() {
    const frequencyExtraAttentionsElement = this.formBuilder.group({
      attentionFrecuency: [''],
    });
    return frequencyExtraAttentionsElement;
  }

  /**
   * add a control to the attention extra array
   */
  addTypeAtentionExtraField() {
    const element = <FormArray>this.serviceForm.controls.typesAttentionExtra;
    if (
      element.length !== this.typesAttention.length &&
      this.typesAttention.length !== 0
    ) {
      element.push(this.initTypesAttentionExtraField());
    }
  }

  /**
   * removes a control from the attention extra array
   * @param index
   */
  removeTypeAttentionExtraField(index: number) {
    const element = <FormArray>this.serviceForm.controls.typesAttentionExtra;
    element.removeAt(index);
  }

  /**
   * adds a control to the sector array
   */
  addSectorField() {
    const element = <FormArray>this.serviceForm.controls.sectors;
    if (element.length !== this.sectors.length && this.sectors.length !== 0) {
      element.push(this.initSectorsField());
    }
  }

  /**
   * removes a control from the sector array
   * @param index
   */
  removeSectorField(index: number) {
    const element = <FormArray>this.serviceForm.controls.sectors;
    element.removeAt(index);
  }

  /**
   * adds a control to the extra attentions array
   */
  addFrequencyExtraAttentionField() {
    const element = <FormArray>this.serviceForm.controls.attentionFrecuency;
    element.push(this.initFrequencyExtraAttentions());
  }

  /**
   * removes a control from the extra attentions array
   * @param index
   */
  removeFrequencyExtraAttentionField(index: number) {
    const element = <FormArray>this.serviceForm.controls.attentionFrecuency;
    element.removeAt(index);
  }

  /**
   * loads the service selected
   */
  loadService() {
    this.loadServiceDependencies()
      .then(() => {
        this.organizationService
          .getOrganizationDetail(this.organizationId)
          .then((response: any) => {
            this.organization = response.organization;
          });
        let item = this.route.snapshot.params.item;
        return this.serviceService.getService(item);
      })
      .then(this.handleShowService.bind(this));
  }

  /**
   * Calls all the services dependencies functions
   */
  loadServiceDependencies() {
    return Promise.all([
      this.loadSectors(),
      this.loadLegalPermissions(),
      this.loadAddresses(),
      this.loadTypesAttentionExtra(),
    ]);
  }

  /**
   * Handles all the service data
   * @param response
   */
  handleShowService(response: any) {
    this.item = response.service.item;
    this.image1Name = this.item.image1Name;
    this.image2Name = this.item.image2Name;
    this.image3Name = this.item.image3Name;
    this.itemFile1.name = this.item.itemFile1;
    this.itemFile2.name = this.item.itemFile2;
    this.itemFile3.name = this.item.itemFile3;
    this.service = response.service.item.service;
    this.breadcrumbService.addBreadCrumb({
      page: this.item.name,
      href: `/#/catalog/page-dashboard/item/update-service/${this.item.idPk}/${this.organizationId}/${this.userId}`,
    });
    this.itemService.setItem(
      this.formBuilder,
      this.serviceForm,
      response.service,
    );
    this.setCostByType();
    this.serviceForm.controls.isPrivate.setValue(this.service.isPrivate);
    this.serviceForm.controls.objective.setValue(this.service.objectives);
    this.serviceForm.controls.reach.setValue(this.service.reaches);
    this.serviceForm.controls.specificSupport.setValue(
      this.service.specificSupports,
    );
    this.serviceForm.controls.typeSupport.setValue(
      Number(this.service.typeSupports),
    );
    this.serviceForm.controls.responsability.setValue(
      this.service.responsabilityPerson,
    );
    this.serviceForm.controls.cover.setValue(Number(this.service.cover));
    this.serviceForm.controls.requirement.setValue(this.service.requirements);
    this.serviceForm.controls.accessibility.setValue(this.service.accesibility);
    this.serviceForm.controls.other.setValue(this.service.others);
    this.serviceForm.controls.hasScheduleExtra.setValue(
      this.service.scheduleExtraordinary,
    );
    this.serviceForm.controls.otherExtra.setValue(
      this.service.otherExtraordinaryAttention,
    );
    this.buildOperationDays(this.service.daysToOperations);
    this.buildServicesToDayOperation(this.service.overtime);
    this.buildTypesAttentionExtra(response.service.typeAttentionExtra);
    this.buildFrequencyAttentionExtra(response.service.extraAttentionFrecuency);
    this.buildSectors(response.service.sector);
    return Promise.resolve();
  }

  /**
   * sets the service cost to the form control
   */
  setCostByType() {
    if (this.service.cost != '') {
      this.serviceForm.controls.cost.setValue(this.service.cost);
    } else {
      this.toggleRangeCost();
      this.serviceForm.controls.startCost.setValue(this.item.startCost);
      this.serviceForm.controls.endCost.setValue(this.item.endCost);
    }
  }

  /**
   * sets the operations days to the form controls
   * @param operationDays
   */
  buildOperationDays(operationDays: any) {
    let daysToOperationGroup = this.serviceForm.controls
      .daysToOperation as FormGroup;
    daysToOperationGroup.controls.monday.setValue(operationDays[0].isOperate);
    daysToOperationGroup.controls.tuesday.setValue(operationDays[1].isOperate);
    daysToOperationGroup.controls.wednesday.setValue(
      operationDays[2].isOperate,
    );
    daysToOperationGroup.controls.thursday.setValue(operationDays[3].isOperate);
    daysToOperationGroup.controls.friday.setValue(operationDays[4].isOperate);
    daysToOperationGroup.controls.saturday.setValue(operationDays[5].isOperate);
    daysToOperationGroup.controls.sunday.setValue(operationDays[6].isOperate);
  }

  /**
   * sets the days to operations to the form controls
   * @param serviceDaysToOperation
   */
  buildServicesToDayOperation(serviceDaysToOperation: any) {
    const serviceDaysToOperationGroup = this.serviceForm.controls
      .serviceDaysToOperation as FormGroup;
    serviceDaysToOperationGroup.controls.monday.setValue(
      serviceDaysToOperation[0].isOperate,
    );
    serviceDaysToOperationGroup.controls.tuesday.setValue(
      serviceDaysToOperation[1].isOperate,
    );
    serviceDaysToOperationGroup.controls.wednesday.setValue(
      serviceDaysToOperation[2].isOperate,
    );
    serviceDaysToOperationGroup.controls.thursday.setValue(
      serviceDaysToOperation[3].isOperate,
    );
    serviceDaysToOperationGroup.controls.friday.setValue(
      serviceDaysToOperation[4].isOperate,
    );
    serviceDaysToOperationGroup.controls.saturday.setValue(
      serviceDaysToOperation[5].isOperate,
    );
    serviceDaysToOperationGroup.controls.sunday.setValue(
      serviceDaysToOperation[6].isOperate,
    );
  }

  /**
   * setst he attentions types to the form controls
   * @param typesAttention
   */
  buildTypesAttentionExtra(typesAttention: any) {
    if (typesAttention.length > 0) {
      let typeAttentionArray = this.serviceForm.controls
        .typesAttentionExtra as FormArray;
      for (let index = 0; index < typesAttention.length; index++) {
        this.addTypeAtentionExtraField();
        let typeAttentionGroup = typeAttentionArray.controls[
          index
        ] as FormGroup;
        typeAttentionGroup.controls.typeAttentionExtra.setValue(
          typesAttention[index].typeAttention.idPk,
        );
      }
    } else {
      this.addTypeAtentionExtraField();
    }
  }

  /**
   * sets the frecuency attentions to the form controls
   * @param frequencyAttention
   */
  buildFrequencyAttentionExtra(frequencyAttention: any) {
    if (frequencyAttention.length > 0) {
      let typeAttentionArray = this.serviceForm.controls
        .attentionFrecuency as FormArray;
      for (let index = 0; index < frequencyAttention.length; index++) {
        this.addFrequencyExtraAttentionField();
        let typeAttentionGroup = typeAttentionArray.controls[
          index
        ] as FormGroup;
        typeAttentionGroup.controls.attentionFrecuency.setValue(
          frequencyAttention[index].attentionFrecuency,
        );
      }
    } else {
      this.addFrequencyExtraAttentionField();
    }
  }

  /**
   * sets the sectos to the from controls
   * @param sectors
   */
  buildSectors(sectors: any) {
    if (sectors.length > 0) {
      let sectorArray = this.serviceForm.controls.sectors as FormArray;
      for (let index = 0; index < sectors.length; index++) {
        this.addSectorField();
        let sectorGroup = sectorArray.controls[index] as FormGroup;
        sectorGroup.controls.sector.setValue(
          sectors[index].sectorClassification.idPk,
        );
      }
    } else {
      this.addSectorField();
    }
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
        this.image1Name = file.name;
        this.serviceForm.controls.image1.setValue(reader.result);
      } else if (type === 2) {
        this.image2Name = file.name;
        this.serviceForm.controls.image2.setValue(reader.result);
      } else if (type === 3) {
        this.image3Name = file.name;
        this.serviceForm.controls.image3.setValue(reader.result);
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
          this.itemFile1 = this.changeNameToFile(file);
          this.editedFile1 = true;
          this.serviceForm.controls.itemFile1.setValue(reader.result);
          break;
        case 2:
          this.itemFile2 = this.changeNameToFile(file);
          this.editedFile2 = true;
          this.serviceForm.controls.itemFile2.setValue(reader.result);
          break;
        case 3:
          this.itemFile3 = this.changeNameToFile(file);
          this.editedFile3 = true;
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
  changeNameToFile(fileToUpload: File) {
    let blob = fileToUpload.slice(0, fileToUpload.size, fileToUpload.type);
    return new File([blob], fileToUpload.name, {type: fileToUpload.type});
  }

  /**
   * validates if the item got any name added to them if they have then post them
   */
  private validateFiles() {
    if (this.editedFile1) {
      if(this.item.itemFile1 !== "") {
        this.deleteFile(this.item.itemFile1);
        this.postFile(this.itemFile1);
      } else {
        this.postFile(this.itemFile1);
      }
    }
    if (this.editedFile2) {
      if(this.item.itemFile2 !== "") {
        this.deleteFile(this.item.itemFile2);
        this.postFile(this.itemFile2);
      } else {
        this.postFile(this.itemFile2);
      }
    }
    if (this.editedFile3) {
      if(this.item.itemFile3 !== "") {
        this.deleteFile(this.item.itemFile3);
        this.postFile(this.itemFile3);
      } else {
        this.postFile(this.itemFile3);
      }
    }
  }

  /**
   * Post the file element into the designate container
   * @param itemFile
   */
  private postFile(itemFile) {
    this.productService.postFile(itemFile, 'servicesFiles');
  }

  /**
   * deletes a file element from designate container
   * @param itemFile
   */
  private deleteFile(itemFile) {
    this.productService.deleteFileInContainer(itemFile, 'servicesFiles');
  }

  /**
   * Sets the service format
   * @param productSource
   */
  serviceFormat(serviceSource: any) {
    const service = {
      idPk: this.service.idPk ? this.service.idPk : '',
      isPrivate: serviceSource.isPrivate,
      cost: serviceSource.cost,
      objectives: serviceSource.objective,
      reaches: serviceSource.reach,
      specificSupports: serviceSource.specificSupport,
      typeSupports: serviceSource.typeSupport,
      daysToOperations: this.itemService.convertDayOperationToArray(
        serviceSource.daysToOperation,
      ),
      responsabilityPerson: serviceSource.responsability,
      cover: serviceSource.cover,
      requirements: serviceSource.requirement,
      accesibility: serviceSource.accessibility,
      others: serviceSource.other,
      scheduleExtraordinary: serviceSource.hasScheduleExtra,
      otherExtraordinaryAttention: serviceSource.otherExtra,
      Items_idPk: this.item.idPk,
      overtime: this.itemService.convertDayOperationToArray(
        serviceSource.serviceDaysToOperation,
      ),
    };

    return service;
  }

  /**
   * builds the service element and call all the format functions
   * @param service
   */
  buildServiceParameters(service: any) {
    const {item, organization} = this.setOrganizationAndItemFormat(service);
    const buildService = {
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
    return buildService;
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
    let sectorValue = this.config.SECTOR_DEFAULT_VALUE;
    if (service.sectors[0]) {
      sectorValue =
        service.sectors[0].sector !== ''
          ? service.sectors
          : this.config.SECTOR_DEFAULT_VALUE;
    }
    return this.sectorFormat(sectorValue);
  }

  private setTypeAttentionExtraFormat(service: any) {
    let typeAttentionExtraValue = this.config
      .TYPE_ATTENTION_EXTRA_DEFAULT_VALUE;
    if (service.typesAttentionExtra[0]) {
      typeAttentionExtraValue =
        service.typesAttentionExtra[0].typeAttentionExtra !== ''
          ? service.typesAttentionExtra
          : this.config.TYPE_ATTENTION_EXTRA_DEFAULT_VALUE;
    }
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
    const organizationValue = this.organizationId
      ? this.organizationId
      : this.config.ORGANIZATION_DEFAULT_VALUE;
    service.image1Name = this.image1Name;
    service.image2Name = this.image2Name;
    service.image3Name = this.image3Name;
    service.itemFile1 = this.itemFile1 !== undefined ? this.itemFile1.name : '';
    service.itemFile2 = this.itemFile2 !== undefined ? this.itemFile2.name : '';
    service.itemFile3 = this.itemFile3 !== undefined ? this.itemFile3.name : '';
    obj.item = this.itemService.itemFormat(
      service,
      organizationValue,
      this.item.idPk,
    );
    obj.organization = this.itemService.organizationFormat(organizationValue);
    return obj;
  }

  private setLegalPermissionsFormat(service: any) {
    let legalPermissionValue = this.config.LEGAL_PERMISSION_DEFAULT_VALUE;
    if (service.legalPermissions[0]) {
      legalPermissionValue =
        service.legalPermissions[0].legalPermission !== ''
          ? service.legalPermissions
          : this.config.LEGAL_PERMISSION_DEFAULT_VALUE;
    }
    return this.itemService.legalPermissionFormat(legalPermissionValue);
  }

  private setTypeAttentionFormat(service: any) {
    let typeAttentionValue = this.config.TYPE_ATTENTION_DEFAULT_VALUE;
    if (service.typesAttention[0]) {
      typeAttentionValue =
        service.typesAttention[0].typeAttention !== ''
          ? service.typesAttention
          : this.config.TYPE_ATTENTION_DEFAULT_VALUE;
    }
    return this.itemService.typeAttentionFormat(typeAttentionValue);
  }

  private setAddressFormat(service: any) {
    let addressValue = [];
    if (service.addresses.length !== 0) {
      addressValue = service.addresses;
    }
    return this.itemService.addressFormat(addressValue);
  }

  private setCertificateFormat(service: any) {
    const certificateValue = service.certificates;
    return this.itemService.certificateFormat(certificateValue);
  }

  /**
   * updates the service selected
   * @param service
   * @param isValid
   */
  update(service: any, isValid: boolean) {
    this.validName = true;
    this.validOrg = true;
    this.validStartCost = true;
    this.validEndCost = true;
    this.costError = "";
    this.isFormValid = this.itemService.isDropDownValid(this.dropDownElements);
    if (isValid) {
      if (this.validateNotification(service)) {
        const buildParameters = this.buildServiceParameters(service);
        this.serviceService
          .putService(buildParameters)
          .then(this.handleServiceCreated.bind(this))
          .catch(() => {
            this.notificationService.alertThis(
              'No se ha podido modificar la información.',
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
      'La información ha sido modificada correctamente.',
      'success',
      () => {
        this.router.navigate(['show-service', this.item.idPk, this.userId], {
          relativeTo: this.route.parent,
        });
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

  loadLegalPermissions() {
    this.legalPermissionService
      .getLegalPermissions(this.organizationId)
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

  loadAddresses() {
    this.addressService
      .getAddressesByOrganizationId(this.organizationId)
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

  /**
   * Sets the subtitle of the page
   */
  showSubTitle() {
    if (this.next === 0) {
      this.info = 'Información General del Servicio';
    } else if (this.next === 1) {
      this.info = 'Características del Servicio';
    } else if (this.next === 2) {
      this.info = 'Disponibilidad del Servicio';
    }
  }

  /**
   * Sets next based on the page the user is
   */
  nextInfo() {
    this.next = this.next <= 3 ? this.next + 1 : this.next;
    this.showSubTitle();
  }

  /**
   * Sets next based on the page the user is
   */
  prevInfo() {
    this.next = this.next > 0 ? this.next - 1 : this.next;
    this.showSubTitle();
  }
}

export {ServiceUpdateComponent};
