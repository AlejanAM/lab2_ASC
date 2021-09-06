import {Component, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ItemsService} from '../../../items.service';
import {ItemService} from '../../../item/item.service';
import {ProductService} from '../product.service';
import {GroupService} from '../../../../group/group.service';
import {CategoryService} from '../../../../category/category.service';
import {LegalPermissionService} from '../../../../legal-permission/legal-permission.service';
import {AddressService} from '../../../../address/address.service';
import {TypeAttentionService} from '../../../../type-attention/type-attention.service';
import {CoreConstants} from '../../../../../core/core.constants';
import {SharedService} from '../../../../../shared/shared.service';
import {ModalNotificationService} from '../../../../../utils/modal/notifications/modal-notifications.service';
import {CatalogNotificationService} from '../../../../../utils/modal/catalog-notification/catalog-notification.service';
import {ICatalogConfig, CATALOG_CONFIG} from '../../../../catalog.config';
import {BreadcrumbService} from '../../../../../shared/breadcrumb.service';
import {ITEM_RANGE_COST_ERRORS} from '../../item.constants'

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  providers: [
    ItemsService,
    ProductService,
    ItemService,
    GroupService,
    CategoryService,
    LegalPermissionService,
    AddressService,
    TypeAttentionService,
  ],
})
class ProductCreateComponent implements OnInit {
  public productForm: FormGroup;
  public submitted: boolean;
  public events: any[];
  public showMessage: boolean;
  public isSuccessful: boolean;
  public isFormValid: boolean;
  public disableButton: boolean;
  public disableNext: boolean;
  public groups: any;
  public categories: any;
  public legalPermissions: any;
  public addresses: any;
  public typesAttention: any;
  public hasChildren: boolean;
  public dropDownElements: any;
  public legalPermissionDropDown: any;
  public addressDropDown: any;
  public typeAttentionDropDown: any;
  public divisionDropDown: any;
  public groupDropDown: any;
  public organizations: any;
  public category: number;
  public subCategory: number;
  public division: number;
  public add: number;
  public categoryDropDowns: any;
  public firstCategoriesSearch: any;
  public secondCategoriesSearch: any;
  public thirdCategoriesSearch: any;
  public divisionName: any;
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
    public formBuilder: FormBuilder,
    public itemService: ItemService,
    public sharedService: SharedService,
    private itemsService: ItemsService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private groupService: GroupService,
    private legalPermissionService: LegalPermissionService,
    private addressService: AddressService,
    private typeAttentionService: TypeAttentionService,
    private notificationService: ModalNotificationService,
    private catalogNotification: CatalogNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.events = [];
    this.groups = [];
    this.categories = [];
    this.legalPermissions = [];
    this.addresses = [];
    this.typesAttention = [];
    this.showMessage = false;
    this.isSuccessful = false;
    this.hasChildren = false;
    this.isFormValid = true;
    this.disableButton = false;
    this.disableNext = true;
    this.groupDropDown = {};
    this.divisionDropDown = {};
    this.addressDropDown = {};
    this.typeAttentionDropDown = {};
    this.legalPermissionDropDown = {};
    this.dropDownElements = [];
    this.categoryDropDowns = [];
    this.firstCategoriesSearch = [];
    this.secondCategoriesSearch = [];
    this.thirdCategoriesSearch = [];
    this.divisionName = [];
    this.info = 'Información General del Producto';
    this.next = 0;
    this.add = 0;
    this.costError = '';
    this.rangeCost = false;
    this.validName = true;
    this.validOrg = true;
    this.validStartCost = true;
    this.validEndCost = true;
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params.userIdPk;
    this.addBreadCrumb(this.userId);
    this.loadGroups();
    this.loadTypesAttention();
    this.formConfiguration();
    this.itemService
      .getOrganization(this.userId)
      .then(this.handleOrganizations.bind(this))
      .catch((err: any) => err);
    this.itemsService
      .getSearchCategorie(0, 0)
      .then(this.handleFirstCategorySearch.bind(this))
      .catch((err) => err);
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
      page: 'Crear Producto',
      href: `/#/catalog/page-dashboard/item/create-product/${idUser}`,
    });
  }

  formConfiguration() {
    this.productForm = this.formBuilder.group({
      code: [''],
      name: ['', [Validators.required]],
      organization: ['', [Validators.required]],
      description: [''],
      observations: [''],
      image1: [''],
      image2: [''],
      image3: [''],
      itemFile1: [''],
      itemFile2: [''],
      itemFile3: [''],
      visibility: [true],
      isProduct: [true],
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
      warranty: [''],
      inStock: [true],
      timeDelevery: [''],
      warrantyImported: [true],
      customProduct: [false],
      usefulLife: [''],
      spareParts: this.formBuilder.array([this.initSparePartField()]),
      primaryFunctionalities: [''],
      secondlyFunctionalities: this.formBuilder.array([
        this.initSecondaryFuncionalityField(),
      ]),
      brand: [''],
      model: [''],
      height: [''],
      width: [''],
      deep: [''],
      weight: [''],
      groups: this.formBuilder.array([this.initGroupField()]),
      categories: this.formBuilder.array([this.initCategoryField()]),
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
    });
  }

  /**
   * Toggles between enabling the cost input or the ranges cost inputs
   */
  toggleRangeCost() {
    if (this.rangeCost) {
      this.rangeCost = false;
      this.productForm.controls.cost.enable();
      this.productForm.controls.startCost.disable();
      this.productForm.controls.startCost.setValue('');
      this.productForm.controls.endCost.disable();
      this.productForm.controls.endCost.setValue('');
    } else {
      this.rangeCost = true;
      this.productForm.controls.cost.disable();
      this.productForm.controls.cost.setValue('');
      this.productForm.controls.startCost.enable();
      this.productForm.controls.endCost.enable();
    }
  }

  handleFirstCategorySearch(response: any) {
    let dropDownObj = {
      first: response,
    };
    this.categoryDropDowns.push(dropDownObj);
  }

  handleThirdCategorySearch(response: any) {
    this.divisionDropDown = {
      isValid: true,
      name: 'category',
    };
    this.dropDownElements.push(this.divisionDropDown);
    response.map((division) => {
      this.divisionName[division.idPk] = division.name;
    });
  }

  handleOrganizations(response: any) {
    this.organizations = response.organizations;
  }

  getSecondSearchLevel(level: number, index: number) {
    this.itemsService
      .getSearchCategorie(level, 1)
      .then((response: any) => {
        this.categoryDropDowns[index].second = response;
      })
      .catch((err) => err);
  }

  getThirdSearchLevel(level: number, index: number) {
    this.itemsService
      .getSearchCategorie(level, 2)
      .then((response: any) => {
        this.divisionDropDown = {
          isValid: true,
          name: 'division',
        };
        this.dropDownElements.push(this.divisionDropDown);
        this.categoryDropDowns[index].third = response;
        response.map((division) => {
          this.divisionName[division.idPk] = division.name;
        });
      })
      .catch((err) => err);
  }

  selectOrganization() {
    this.disableNext = false;
    this.loadLegalPermissions();
    this.loadAddresses();
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
        this.productForm.controls.image1.setValue(reader.result);
      } else if (type === 2) {
        this.image2Name = file.name;
        this.productForm.controls.image2.setValue(reader.result);
      } else if (type === 3) {
        this.image3Name = file.name;
        this.productForm.controls.image3.setValue(reader.result);
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
          this.productForm.controls.itemFile1.setValue(reader.result);
          break;
        case 2:
          this.itemFile2 = this.changeNameToFile(file, 1);
          this.productForm.controls.itemFile2.setValue(reader.result);
          break;
        case 3:
          this.itemFile3 = this.changeNameToFile(file, 1);
          this.productForm.controls.itemFile3.setValue(reader.result);
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

  initSparePartField() {
    const sparePartElement = this.formBuilder.group({
      sparePart: [''],
    });
    return sparePartElement;
  }

  initSecondaryFuncionalityField() {
    const secondaryFunctionalityElement = this.formBuilder.group({
      secondaryFunctionality: [''],
    });
    return secondaryFunctionalityElement;
  }

  initGroupField() {
    const groupElement = this.formBuilder.group({
      group: [''],
    });
    return groupElement;
  }

  initCategoryField() {
    const categoryElement = this.formBuilder.group({
      class: [''],
      subClass: [''],
      division: [''],
    });
    return categoryElement;
  }

  addGroupField() {
    const element = <FormArray>this.productForm.controls.groups;
    if (element.length !== this.groups.length && this.groups.length !== 0) {
      element.push(this.initGroupField());
    }
  }

  removeGroupField(index: number) {
    const element = <FormArray>this.productForm.controls.groups;
    element.removeAt(index);
  }

  addCategoryField(index: number) {
    this.add = this.add + 1;
    const element = <FormArray>this.productForm.controls.categories;
    element.push(this.initCategoryField());

    this.itemsService
      .getSearchCategorie(0, 0)
      .then(this.handleFirstCategorySearch.bind(this))
      .catch((err) => err);
  }

  removeCategoryField(index: number) {
    this.add = this.add - 1;
    const element = <FormArray>this.productForm.controls.categories;
    element.removeAt(index);
  }

  addSparePartField() {
    const element = <FormArray>this.productForm.controls.spareParts;
    element.push(this.initSparePartField());
  }

  removeSparePartField(index: number) {
    const element = <FormArray>this.productForm.controls.spareParts;
    element.removeAt(index);
  }

  /**
   * Add a control to the array functionality
   */
  addSecondaryFunctionalityField() {
    const element = <FormArray>(
      this.productForm.controls.secondlyFunctionalities
    );
    element.push(this.initSecondaryFuncionalityField());
  }

  /**
   * Remove a control from the array functionality
   * @param index
   */
  removeSecondaryFunctionalityField(index: number) {
    const element = <FormArray>(
      this.productForm.controls.secondlyFunctionalities
    );
    element.removeAt(index);
  }

  /**
   * Validates the cost of the product if the range cost was active
   * @param startCost
   * @param endCost
   */
  validateRangeCost(startCost, endCost) {
    let errorCounter = 0;
    if(this.productForm.controls.startCost.errors) {
      this.validStartCost = false;
      errorCounter++;
    }
    if(this.productForm.controls.endCost.errors) {
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

  loadGroups() {
    this.groupService
      .getGroups()
      .then(this.handleGroupsLoaded.bind(this))
      .catch(this.catchGroups);
  }

  handleGroupsLoaded(response: any) {
    if (response.groups.length) {
      this.groupDropDown = {
        isValid: true,
        name: 'group',
      };
      this.dropDownElements.push(this.groupDropDown);
      response.groups.map((group) => {
        this.groups.push(group);
      });
    }
  }

  catchGroups() {
    console.log('Error...');
  }

  loadLegalPermissions() {
    this.legalPermissionService
      .getLegalPermissions(this.productForm.controls.organization.value)
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
      .getAddressesByOrganizationId(
        this.productForm.controls.organization.value,
      )
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

  loadTypesAttention() {
    this.typeAttentionService
      .getTypesAttention(!CoreConstants.IS_PRODUCT)
      .then(this.handleTypesAttentionLoaded.bind(this))
      .catch(this.catchTypesAttention);
  }

  handleTypesAttentionLoaded(response: any) {
    if (response.typesAttention.length) {
      this.typeAttentionDropDown = {
        isValid: true,
        name: 'typeAttention',
      };
      this.dropDownElements.push(this.typeAttentionDropDown);
      response.typesAttention.map((typeAttention) => {
        this.typesAttention.push(typeAttention);
      });
    }
  }

  catchTypesAttention() {
    console.log('Error...');
  }

  categoryFormat(categories: any) {
    const categoriesObj = {
      productCategories: categories,
    };
    return categoriesObj;
  }

  groupFormat(groups: any) {
    const groupsObj = {
      productGroups: groups,
    };
    return groupsObj;
  }

  private setGroupFormat(product: any) {
    const groupValue =
      product.groups[0].group !== ''
        ? product.groups
        : this.config.GROUP_DEFAULT_vALUE;
    return this.groupFormat(groupValue);
  }

  private setCategoryFormat(product: any) {
    const categoryValue =
      product.categories[0].division !== ''
        ? product.categories
        : this.config.CATEGORY_DEFAULT_VALUE;
    return this.categoryFormat(categoryValue);
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
    this.productService.postFile(itemFile, 'productFiles').then();
  }

  /**
   * Sets the product format
   * @param productSource
   */
  private productFormat(productSource: any) {
    const product = {
      idPk: '',
      cost: productSource.cost,
      warranty: productSource.warranty,
      inStock: productSource.inStock,
      timeDelevery: productSource.timeDelevery,
      warrantyImported: productSource.warrantyImported,
      usefulLife: productSource.usefulLife,
      spareParts: productSource.spareParts,
      primaryFunctionalities: productSource.primaryFunctionalities,
      secondlyFunctionalities: productSource.secondlyFunctionalities,
      brand: productSource.brand,
      model: productSource.model,
      height: productSource.height,
      width: productSource.width,
      deep: productSource.deep,
      weight: productSource.weight,
      Items_idPk: 0, // tslint: disable-line
    };
    return product;
  }

  /**
   * Sets the organization format
   * @param product
   */
  private setOrganizationAndItemFormat(product: any) {
    let obj = {
      item: null,
      organization: null,
    };
    const organizationValue = this.productForm.controls.organization.value
      ? this.productForm.controls.organization.value
      : this.config.ORGANIZATION_DEFAULT_VALUE;
    const imgSrc = product.image1 ? product.image1 : this.config.IMG_SRC;
    product.image1 = imgSrc;
    product.image1Name = this.image1Name;
    product.image2Name = this.image2Name;
    product.image3Name = this.image3Name;
    product.itemFile1 = this.itemFile1 !== undefined ? this.itemFile1.name : '';
    product.itemFile2 = this.itemFile2 !== undefined ? this.itemFile2.name : '';
    product.itemFile3 = this.itemFile3 !== undefined ? this.itemFile3.name : '';
    obj.item = this.itemService.itemFormat(product, organizationValue, null);
    obj.organization = this.itemService.organizationFormat(organizationValue);
    return obj;
  }
  /**
   * Sets the legal permission format
   * @param product
   */
  private setLegalPermissionsFormat(product: any) {
    const legalPermissionValue =
      product.legalPermissions[0].legalPermission !== ''
        ? product.legalPermissions
        : this.config.LEGAL_PERMISSION_DEFAULT_VALUE;
    return this.itemService.legalPermissionFormat(legalPermissionValue);
  }

  /**
   * Sets the attention format
   * @param product
   */
  private setTypeAttentionFormat(product: any) {
    const typeAttentionValue =
      product.typesAttention[0].typeAttention !== ''
        ? product.typesAttention
        : this.config.TYPE_ATTENTION_DEFAULT_VALUE;
    return this.itemService.typeAttentionFormat(typeAttentionValue);
  }

  /**
   * Sets the address format
   * @param product
   */
  private setAddressFormat(product: any) {
    const addressValue =
      product.addresses[0].address !== ''
        ? product.addresses
        : this.config.ADDRESS_DEFAULT_VALUE;
    return this.itemService.addressFormat(addressValue);
  }

  /**
   * Sets the certificate format
   * @param product
   */
  private setCertificateFormat(product: any) {
    const certificateValue = product.certificates;
    return this.itemService.certificateFormat(certificateValue);
  }

  /**
   * Sets the product format
   * @param product
   */
  private setProductFormat(product: any) {
    const format = {
      idPk: '',
      cost: product.cost ? product.cost : '',
      warranty: product.warranty ? product.warranty : '',
      inStock: product.inStock,
      timeDelevery: product.timeDelevery ? product.timeDelevery : '',
      warrantyImported: product.warrantyImported,
      customProduct: product.customProduct,
      usefulLife: product.usefulLife ? product.usefulLife : '',
      spareParts: product.spareParts ? product.spareParts : {},
      primaryFunctionalities: product.primaryFunctionalities
        ? product.primaryFunctionalities
        : '',
      secondlyFunctionalities: product.secondlyFunctionalities
        ? product.secondlyFunctionalities
        : '',
      brand: product.brand ? product.brand : '',
      model: product.model ? product.model : '',
      height: product.height ? product.height : '',
      width: product.width ? product.width : '',
      deep: product.deep ? product.deep : '',
      weight: product.weight ? product.weight : '',
      Items_idPk: 0, // tslint: disable-line
    };
    return format;
  }

  /**
   * Build the product parameters before create the product, this method call all the format functions
   * @param product
   */
  buildProductParamters(product: any) {
    const {item, organization} = this.setOrganizationAndItemFormat(product);
    const buildProduct = {
      // implement localStorage for organization id value
      organization: organization,
      addresses: this.setAddressFormat(product),
      typesAttention: this.setTypeAttentionFormat(product),
      legalPermissions: this.setLegalPermissionsFormat(product),
      categories: this.setCategoryFormat(product),
      groups: this.setGroupFormat(product),
      product: this.setProductFormat(product),
      item: item,
      certificates: this.setCertificateFormat(product),
    };

    return buildProduct;
  }

  /**
   * Creates a new product
   * @param product
   * @param isValid
   */
  save(product: any, isValid: boolean) {
    this.validName = true;
    this.validOrg = true;
    this.validStartCost = true;
    this.validEndCost = true;
    this.costError = "";
    if (isValid) {
      if (this.validateNotification(product)) {
        const buildParameters = this.buildProductParamters(product);
        this.productService
          .postProduct(buildParameters)
          .then(this.handleProductCreated.bind(this))
          .catch((error) => {
            this.notificationService.alertThis(
              'No se ha podido registrar la información',
              'error',
              () => {},
            );
          });
      }
    } else {
      this.validateNotification(product);
    }
  }

  /**
   * Validate function for inputs errors o required errors
   * @param product
   */
  validateNotification(product) {
    let errorInputs = 0;
    let requiredInputs = 0;
    let validProduct = true;
    if (product.startCost != undefined && product.endCost != undefined) {
      errorInputs = this.validateRangeCost(product.startCost, product.endCost);
      if (errorInputs > 0) {
        validProduct = false;
      }
    }
    if (product.name === '') {
      requiredInputs++;
      this.validName = false;
      validProduct = false;
    }
    if (product.organization === '') {
      requiredInputs++;
      this.validOrg = false;
      validProduct = false;
    }
    if (!validProduct) {
      this.catalogNotification.alertThis(
        `${errorInputs},${requiredInputs}`,
        'error',
        () => {},
      );
    }
    return validProduct;
  }

  /**
   * Shows a success messages and algo validates the new files
   * @param response
   */
  handleProductCreated(response: any) {
    this.validateFiles();
    this.notificationService.alertThis(
      'La información ha sido registrada correctamente',
      'success',
      () => {
        this.router.navigate(['/catalog/page-dashboard']);
      },
    );
  }

  onChangeDropDownValidation(formGroupName: string, controlName: string) {
    this.isFormValid = this.itemService.warningElementNotAllow(
      this.dropDownElements,
      this.productForm,
      formGroupName,
      controlName,
    );
  }

  /**
   * Sets the subtitle of the page
   */
  showSubTitle() {
    if (this.next === 0) {
      this.info = 'Información General del Producto';
    } else if (this.next === 1) {
      this.info = 'Características del Producto';
    } else if (this.next === 2) {
      this.info = 'Disponibilidad del Producto';
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
export {ProductCreateComponent};
