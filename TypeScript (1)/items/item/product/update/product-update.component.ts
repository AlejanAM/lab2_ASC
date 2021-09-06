import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {ItemsService} from '../../../items.service';
import {ItemService} from '../../../item/item.service';
import {ProductService} from '../product.service';
import {GroupService} from '../../../../group/group.service';
import {CategoryService} from '../../../../category/category.service';
import {LegalPermissionService} from '../../../../legal-permission/legal-permission.service';
import {AddressService} from '../../../../address/address.service';
import {TypeAttentionService} from '../../../../type-attention/type-attention.service';
import {CoreConstants} from '../../../../../core/core.constants';
import {OrganizationService} from '../../../../organizations/organization.service';
import {SharedService} from '../../../../../shared/shared.service';
import {ModalNotificationService} from '../../../../../utils/modal/notifications/modal-notifications.service';
import {CatalogNotificationService} from '../../../../../utils/modal/catalog-notification/catalog-notification.service';
import {ICatalogConfig, CATALOG_CONFIG} from '../../../../catalog.config';
import {BreadcrumbService} from '../../../../../shared/breadcrumb.service';
import {ITEM_RANGE_COST_ERRORS} from '../../item.constants'


@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss'],
  providers: [
    ProductService,
    ItemService,
    ItemsService,
    GroupService,
    CategoryService,
    LegalPermissionService,
    AddressService,
    TypeAttentionService,
    OrganizationService,
  ],
})
class ProductUpdateComponent implements OnInit {
  public productForm: FormGroup;
  public events: any[];
  public showMessage: boolean;
  public isSuccessful: boolean;
  public isFormValid: boolean;
  public disableButton: boolean;
  public groups: any;
  public legalPermissions: any;
  public addresses: any;
  public typesAttention: any;
  public productDetail: any;
  public dropDownElements: any;
  public legalPermissionDropDown: any;
  public addressDropDown: any;
  public typeAttentionDropDown: any;
  public categoryDropDown: any;
  public groupDropDown: any;
  public category: number;
  public subCategory: number;
  public division: number;
  public add: number;
  public categoryDropDowns: any;
  public firstCategoriesSearch: any;
  public secondCategoriesSearch: any;
  public thirdCategoriesSearch: any;
  public divisionName: any;
  public itemsSearched: any;
  public info: string;
  public organization: any;
  private divisions: any;
  private subClasses: any;
  private classes: any;
  private userId: number;
  private next: number;
  private item: any;
  private product: any;
  private organizationId: number;
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
    public formBuilder: FormBuilder,
    public itemService: ItemService,
    public sharedService: SharedService,
    private organizationService: OrganizationService,
    private notificationService: ModalNotificationService,
    private itemsService: ItemsService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private catalogNotification: CatalogNotificationService,
    private groupService: GroupService,
    private legalPermissionService: LegalPermissionService,
    private addressService: AddressService,
    private typeAttentionService: TypeAttentionService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.events = [];
    this.groups = [];
    this.legalPermissions = [];
    this.addresses = [];
    this.typesAttention = [];
    this.productDetail = {};
    this.itemFile1 = {};
    this.itemFile2 = {};
    this.itemFile3 = {};
    this.editedFile1 = false;
    this.editedFile2 = false;
    this.editedFile3 = false;
    this.showMessage = false;
    this.isSuccessful = false;
    this.isFormValid = true;
    this.disableButton = false;
    this.dropDownElements = [];
    this.categoryDropDowns = [];
    this.firstCategoriesSearch = [];
    this.secondCategoriesSearch = [];
    this.thirdCategoriesSearch = [];
    this.divisionName = [];
    this.itemsSearched = [];
    this.divisions = [];
    this.subClasses = [];
    this.classes = [];
    this.info = 'Información General del Producto';
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
    this.organizationId = this.route.snapshot.params.organizationId;
    this.userId = this.route.snapshot.params.userIdPk;
    this.formConfiguration();
    this.loadProduct();
  }

  formConfiguration() {
    this.productForm = this.formBuilder.group({
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
      warranty: [''],
      inStock: [true],
      timeDelevery: [''],
      warrantyImported: [true],
      customProduct: [false],
      usefulLife: [''],
      spareParts: this.formBuilder.array([]),
      primaryFunctionalities: [''],
      secondlyFunctionalities: this.formBuilder.array([]),
      brand: [''],
      model: [''],
      height: [''],
      width: [''],
      deep: [''],
      weight: [''],
      groups: this.formBuilder.array([]),
      categories: this.formBuilder.array([]),
      legalPermissions: this.formBuilder.array([]),
      addresses: this.formBuilder.array([]),
      typesAttention: this.formBuilder.array([]),
      certificates: this.formBuilder.array([]),
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
    response.map((division) => {
      this.divisionName[division.idPk] = division.name;
    });
  }

  getSecondSearchLevel(level: number, index: number) {
    this.secondCategoriesSearch = [];
    this.thirdCategoriesSearch = [];
    this.itemsSearched = [];
    this.itemsService
      .getSearchCategorie(level, 1)
      .then((response: any) => {
        this.categoryDropDowns[index].second = response;
      })
      .catch((err) => err);
  }

  getThirdSearchLevel(level: number, index: number) {
    this.thirdCategoriesSearch = [];
    this.itemsSearched = [];
    this.itemsService
      .getSearchCategorie(level, 2)
      .then((response: any) => {
        this.categoryDropDown = {
          isValid: true,
          name: 'category',
        };
        this.dropDownElements.push(this.categoryDropDown);
        this.categoryDropDowns[index].third = response;
        response.map((division) => {
          this.divisionName[division.idPk] = division.name;
        });
      })
      .catch((err) => err);
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
          this.itemFile1 = this.changeNameToFile(file);
          this.editedFile1 = true;
          this.productForm.controls.itemFile1.setValue(reader.result);
          break;
        case 2:
          this.itemFile2 = this.changeNameToFile(file);
          this.editedFile2 = true;
          this.productForm.controls.itemFile2.setValue(reader.result);
          break;
        case 3:
          this.itemFile3 = this.changeNameToFile(file);
          this.editedFile3 = true;
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
   */
  changeNameToFile(fileToUpload: File) {
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

  loadProduct() {
    this.loadProductDependencies().then(() => {
      let item = this.route.snapshot.params.item;
      this.organizationService
        .getOrganizationDetail(this.organizationId)
        .then((response: any) => {
          this.organization = response.organization;
        });
      this.productService
        .getProduct(item)
        .then(this.handleShowProduct.bind(this));
    });
  }

  loadProductDependencies() {
    return Promise.all([
      this.loadGroups(),
      this.loadDivisions(),
      this.loadLegalPermissions(),
      this.loadAddresses(),
      this.loadTypesAttention(),
    ]);
  }

  handleShowProduct(response: any) {
    this.item = response.product.item;
    this.image1Name = this.item.image1Name;
    this.image2Name = this.item.image2Name;
    this.image3Name = this.item.image3Name;
    this.itemFile1.name = this.item.itemFile1;
    this.itemFile2.name = this.item.itemFile2;
    this.itemFile3.name = this.item.itemFile3;
    this.product = response.product.item.product;
    this.breadcrumbService.addBreadCrumb({
      page: this.item.name,
      href: `/#/catalog/page-dashboard/item/update-product/${this.item.idPk}/${this.organizationId}/${this.userId}`,
    });
    this.itemService.setItem(
      this.formBuilder,
      this.productForm,
      response.product,
    );
    this.setCostByType();
    this.productForm.controls.warranty.setValue(this.product.warranty);
    this.productForm.controls.inStock.setValue(this.product.inStock);
    this.productForm.controls.timeDelevery.setValue(this.product.timeDelevery);
    this.productForm.controls.warrantyImported.setValue(
      this.product.warrantyImported,
    );
    this.productForm.controls.customProduct.setValue(
      this.product.customProduct,
    );
    this.productForm.controls.usefulLife.setValue(this.product.usefulLife);
    this.productForm.controls.primaryFunctionalities.setValue(
      this.product.primaryFunctionalities,
    );
    this.productForm.controls.brand.setValue(this.product.brand);
    this.productForm.controls.model.setValue(this.product.model);
    this.productForm.controls.height.setValue(this.product.height);
    this.productForm.controls.width.setValue(this.product.width);
    this.productForm.controls.deep.setValue(this.product.deep);
    this.productForm.controls.weight.setValue(this.product.weight);
    this.buildSpareParts(this.product.spareParts);
    this.buildSecondaryFunctionalities(this.product.secondlyFunctionalities);
    this.buildGroups(response.product.groups);
    this.buildCategories(response.product.categories, this.product.idPk);
  }

  setCostByType() {
    if (this.product.cost != '') {
      this.productForm.controls.cost.setValue(this.product.cost);
    } else {
      this.toggleRangeCost();
      this.productForm.controls.startCost.setValue(this.item.startCost);
      this.productForm.controls.endCost.setValue(this.item.endCost);
    }
  }

  buildSpareParts(spareParts: any) {
    let sparePartsArray = this.productForm.controls.spareParts as FormArray;
    if (spareParts) {
      for (let index = 0; index < spareParts.length; index++) {
        this.addSparePartField();
        let sparePartsGroup = sparePartsArray.controls[index] as FormGroup;
        sparePartsGroup.controls.sparePart.setValue(
          spareParts[index].sparePart,
        );
      }
    } else {
      this.addSparePartField();
    }
  }

  buildSecondaryFunctionalities(secondaryFunctionalities: any) {
    let secondaryFunctArray = this.productForm.controls
      .secondlyFunctionalities as FormArray;
    if (secondaryFunctionalities) {
      for (let index = 0; index < secondaryFunctionalities.length; index++) {
        this.addSecondaryFunctionalityField();
        let secondaryFunctGroup = secondaryFunctArray.controls[
          index
        ] as FormGroup;
        secondaryFunctGroup.controls.secondaryFunctionality.setValue(
          secondaryFunctionalities[index].secondaryFunctionality,
        );
      }
    } else {
      this.addSecondaryFunctionalityField();
    }
  }

  buildGroups(groups: any) {
    if (groups.length > 0) {
      let groupArray = this.productForm.controls.groups as FormArray;
      for (let index = 0; index < groups.length; index++) {
        this.addGroupField();
        let groupGroup = groupArray.controls[index] as FormGroup;
        groupGroup.controls.group.setValue(groups[index].group.idPk);
      }
    } else {
      this.addGroupField();
    }
  }

  buildCategories(categories: any, productId: number) {
    this.buildDivisions(categories);
    this.buildClassesAndSubClasses(categories, productId);
  }

  buildDivisions(categories: any) {
    if (categories.length > 0) {
      let categoryArray = this.productForm.controls.categories as FormArray;
      for (let index = 0; index < categories.length; index++) {
        this.addCategoryField(index);
        let categoryGroup = categoryArray.controls[index] as FormGroup;
        categoryGroup.controls.division.setValue(
          categories[index].categories.idPk,
        );
      }
    } else {
      this.addCategoryField(0);
    }
  }

  buildClassesAndSubClasses(categories: any, productId: number) {
    this.categoryService
      .getAllCategories(0, 0, productId)
      .then((categories: any) => {
        let categoryArray = this.productForm.controls.categories as FormArray;
        categories.subClasses.map((subClass, index) => {
          let categoryGroup = categoryArray.controls[index] as FormGroup;
          categoryGroup.controls.subClass.setValue(subClass.idPk);
          this.getThirdSearchLevel(
            categoryGroup.controls.subClass.value,
            index,
          );
        });

        categories.classes.map((classCategory, index) => {
          let categoryGroup = categoryArray.controls[index] as FormGroup;
          categoryGroup.controls.class.setValue(classCategory.idPk);
          this.getSecondSearchLevel(categoryGroup.controls.class.value, index);
        });
      });
  }

  loadGroups() {
    let group = this.groupService
      .getGroups()
      .then(this.handleGroupsLoaded.bind(this))
      .catch(this.catchGroups);
    return group;
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
    Promise.resolve();
  }

  catchGroups() {
    console.log('Error...');
  }

  loadDivisions() {
    const category = this.categoryService
      .getCategories()
      .then(this.handleDivisionsLoaded.bind(this))
      .catch(this.catchDivisions);
    return category;
  }

  handleDivisionsLoaded(response: any) {
    if (response.categories.length) {
      response.categories.map((category) => {
        this.divisions.push(category);
      });
    }
  }

  catchDivisions() {
    console.log('Error...');
  }

  loadLegalPermissions() {
    let legalPermission = this.legalPermissionService
      .getLegalPermissions(this.organizationId)
      .then(this.handleLegalPermissionsLoaded.bind(this))
      .catch(this.catchLegalPermissions);
    return legalPermission;
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
    let address = this.addressService
      .getAddressesByOrganizationId(this.organizationId)
      .then(this.handleAddressesLoaded.bind(this))
      .catch(this.catchAddresses);
    return address;
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
    let typeAttention = this.typeAttentionService
      .getTypesAttention(!CoreConstants.IS_PRODUCT)
      .then(this.handleTypesAttentionLoaded.bind(this))
      .catch(this.catchTypesAttention);
    return typeAttention;
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
    let groupValue = this.config.GROUP_DEFAULT_vALUE;
    if (product.groups[0]) {
      groupValue =
        product.groups[0].group !== ''
          ? product.groups
          : this.config.GROUP_DEFAULT_vALUE;
    }
    return this.groupFormat(groupValue);
  }

  private setCategoryFormat(product: any) {
    let categoryValue = this.config.CATEGORY_DEFAULT_VALUE;
    if (product.categories[0]) {
      categoryValue =
        product.categories[0].division !== ''
          ? product.categories
          : this.config.CATEGORY_DEFAULT_VALUE;
    }
    return this.categoryFormat(categoryValue);
  }

  private setOrganizationAndItemFormat(product: any) {
    let obj = {
      item: null,
      organization: null,
    };
    product.image1Name = this.image1Name;
    product.image2Name = this.image2Name;
    product.image3Name = this.image3Name;
    product.itemFile1 = this.itemFile1 !== undefined ? this.itemFile1.name : '';
    product.itemFile2 = this.itemFile2 !== undefined ? this.itemFile2.name : '';
    product.itemFile3 = this.itemFile3 !== undefined ? this.itemFile3.name : '';
    obj.item = this.itemService.itemFormat(
      product,
      this.organizationId,
      this.item.idPk,
    );
    obj.organization = this.itemService.organizationFormat(this.organizationId);
    return obj;
  }

  private setLegalPermissionsFormat(product: any) {
    let legalPermissionValue = this.config.LEGAL_PERMISSION_DEFAULT_VALUE;
    if (product.legalPermissions[0]) {
      legalPermissionValue =
        product.legalPermissions[0].legalPermission !== ''
          ? product.legalPermissions
          : this.config.LEGAL_PERMISSION_DEFAULT_VALUE;
    }
    return this.itemService.legalPermissionFormat(legalPermissionValue);
  }

  private setTypeAttentionFormat(product: any) {
    let typeAttentionValue = this.config.TYPE_ATTENTION_DEFAULT_VALUE;
    if (product.typesAttention[0]) {
      typeAttentionValue =
        product.typesAttention[0].typeAttention !== ''
          ? product.typesAttention
          : this.config.TYPE_ATTENTION_DEFAULT_VALUE;
    }
    return this.itemService.typeAttentionFormat(typeAttentionValue);
  }

  private setAddressFormat(product: any) {
    let addressValue = [];
    if (product.addresses.length !== 0) {
      addressValue = product.addresses;
    }
    return this.itemService.addressFormat(addressValue);
  }

  private setCertificateFormat(product: any) {
    const certificateValue = product.certificates;
    return this.itemService.certificateFormat(certificateValue);
  }

  private setProductFormat(product: any) {
    const obj = {
      idPk: this.product.idPk ? this.product.idPk : '',
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
      Items_idPk: this.item.idPk,
    };
    return obj;
  }

  buildProductParameters(product: any) {
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
    this.productService.postFile(itemFile, 'productFiles');
  }

  /**
   * Deletes a file element inside a designate container
   * @param itemFile
   */
  private deleteFile(itemFile) {
    this.productService.deleteFileInContainer(itemFile, 'productFiles');
  }

  /**
   * Updates the produc data
   * @param product
   * @param isValid
   */
  update(product: any, isValid: boolean) {
    this.validName = true;
    this.validOrg = true;
    this.validStartCost = true;
    this.validEndCost = true;
    this.costError = "";
    if (isValid) {
      if (this.validateNotification(product)) {
        const buildParameters = this.buildProductParameters(product);
        this.productService
          .putProduct(buildParameters)
          .then(this.handleProductUpdated.bind(this))
          .catch(() => {
            this.notificationService.alertThis(
              'No se ha podido modificar la información.',
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
  handleProductUpdated(response: any) {
    this.validateFiles();
    this.notificationService.alertThis(
      'La información ha sido modificada correctamente.',
      'success',
      () => {
        this.router.navigate(['show-product', this.item.idPk, this.userId], {
          relativeTo: this.route.parent,
        });
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
export {ProductUpdateComponent};
