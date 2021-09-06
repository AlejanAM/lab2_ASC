import {Injectable, Inject} from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';

import {CoreConstants} from '../../../core/core.constants';

import * as moment from 'moment';

import {ICatalogConfig, CATALOG_CONFIG} from '../../catalog.config';
import {IAppConfig, APP_CONFIG} from '../../../../app.config';

@Injectable()
class ItemService {
  private headers: Headers;
  private requestOptions: RequestOptions;
  private item: any;

  constructor(
    private http: Http,
    @Inject(CATALOG_CONFIG) private config: ICatalogConfig,
    @Inject(APP_CONFIG) public appConfig: IAppConfig
  ) {
    this.headers = new Headers({
      'Content-Type': 'application/json'
    });
    this.requestOptions = new RequestOptions({
      headers: this.headers
    });
  }

  /**
   * Gets the stadistics reports of items for the administrator catalog role
   * @param viewsFilter
   */
  getItemsReports(typeItem, startDate, endDate, typeReport) {
    let params = new URLSearchParams();
    params.set('typeItem', typeItem);
    params.set('startDate', startDate);
    params.set('endDate', endDate);
    this.requestOptions.search = params;
    return this.http
      .get(`${this.appConfig.API_ENDPOINT_CATALOG}/Items/${typeReport}`, this.requestOptions)
      .toPromise()
      .then((response: Response) => Promise.resolve(response.json()))
      .catch((err) => Promise.reject(err));
  }

  /**
   * Gets a file by its name of the container given
   * @param containerName
   * @param fileName
   */
  getFile(containerName: string, fileName: string) {
    return `${this.appConfig.API_ENDPOINT_CATALOG}Containers/${containerName}/download/${fileName}`;
  }

  getItems(id: any, modeToConsult: number, isProduct: any) {
    let params = new URLSearchParams();
    params.set('organizationId', id);
    params.set('isProduct', isProduct);
    params.set('modeToConsult', modeToConsult.toString());
    this.requestOptions.search = params;
    return this.http
      .get(`${this.appConfig.API_ENDPOINT_CATALOG}items/get-items`, this.requestOptions)
      .toPromise()
      .then(
        (response: Response) => Promise.resolve(response.json()),
        (err) => Promise.reject(err)
      );
  }

  checkItemIsNotPending(isChecked: boolean, isApproved: boolean) {
    if (isChecked && !isApproved) {
      return true;
    } else {
      return false;
    }
  }

  addAddressField(formBuilder: FormBuilder, formGroup: FormGroup, addresses: any) {
    const element = <FormArray>formGroup.controls.addresses;
    if (element.length !== addresses.length) {
      element.push(this.initAddressesField(formBuilder));
    }
  }

  removeAddressField(index: number, formBuilder: FormBuilder, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.addresses;
    element.removeAt(index);
  }

  addAgeField(formBuilder: FormBuilder, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.ages;
    element.push(this.initAgeField(formBuilder));
  }

  removeAgeField(index: number, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.ages;
    element.removeAt(index);
  }

  addCertificateField(formBuilder: FormBuilder, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.certificates;
    element.push(this.initCertificatesField(formBuilder));
  }

  removeCertificateField(index: number, formGroup: FormGroup) {
    const element = <FormArray>formGroup.controls.certificates;
    element.removeAt(index);
  }

  addLegalPermissionField(formBuilder: FormBuilder, formGroup: FormGroup, legalPermissions: any) {
    const element = <FormArray>formGroup.controls.legalPermissions;
    if (element.length !== legalPermissions.length) {
      element.push(this.initLegalPermissionsField(formBuilder));
    }
  }

  removeLegalPermissionField(index: number, buildForm: FormGroup) {
    const element = <FormArray>buildForm.controls.legalPermissions;
    element.removeAt(index);
  }

  addTypeAtentionField(formBuilder: FormBuilder, formGroup: FormGroup, typesAttention: any) {
    const element = <FormArray>formGroup.controls.typesAttention;
    if (element.length !== typesAttention.length) {
      element.push(this.initTypesAttentionField(formBuilder));
    }
  }

  removeTypeAttentionField(index: number, buildForm: FormGroup) {
    const element = <FormArray>buildForm.controls.typesAttention;
    element.removeAt(index);
  }

  initAgeField(formBuilder: FormBuilder) {
    const ageElement = formBuilder.group({
      age: ['']
    });
    return ageElement;
  }

  initLegalPermissionsField(formBuilder: FormBuilder) {
    const legalPermissionElement = formBuilder.group({
      legalPermission: ['']
    });
    return legalPermissionElement;
  }

  initCertificatesField(formBuilder: FormBuilder) {
    const certificateElement = formBuilder.group({
      idPk: [''],
      name: [''],
      description: [''],
      isDelete: [false],
      expirationDate: ['']
    });
    return certificateElement;
  }

  initAddressesField(formBuilder: FormBuilder) {
    const addressesElement = formBuilder.group({
      address: ['']
    });
    return addressesElement;
  }

  initTypesAttentionField(formBuilder: FormBuilder) {
    const typesAttentionElement = formBuilder.group({
      typeAttention: [''],
      costDelivery: ['', [Validators.maxLength(50), Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]]
    });
    return typesAttentionElement;
  }

  organizationFormat(organizationId: number) {
    const organization = {
      idPk: organizationId
    };
    return organization;
  }

  itemFormat(itemSource: any, organizationId: number, itemId: any) {
    const item = {
      idPk: itemId ? itemId : '',
      code: itemSource.code ? itemSource.code : '',
      name: itemSource.name,
      description: itemSource.description,
      observations: itemSource.observations,
      image1: itemSource.image1,
      image2: itemSource.image2,
      image3: itemSource.image3,
      visibility: itemSource.visibility,
      isProduct: itemSource.isProduct,
      daysToOperations: this.convertDayOperationToArray(itemSource.daysToOperation),
      typeDeficiency: itemSource.typeDeficiency,
      age: itemSource.ages,
      sex: itemSource.sex,
      startCost: itemSource.startCost,
      endCost: itemSource.endCost,
      isForPregnant: itemSource.isForPregnant,
      isApproved: false,
      isChecked: true,
      organizationsIdFk: organizationId, // tslint: disable-line
      image1Name: itemSource.image1Name,
      image2Name: itemSource.image2Name,
      image3Name: itemSource.image3Name,
      itemFile1: itemSource.itemFile1,
      itemFile2: itemSource.itemFile2,
      itemFile3: itemSource.itemFile3
    };

    return item;
  }

  setItem(formBuilder: FormBuilder, formGroup: FormGroup, productOrService: any) {
    formGroup.controls.code.setValue(productOrService.item.code);
    formGroup.controls.name.setValue(productOrService.item.name);
    formGroup.controls.description.setValue(productOrService.item.description);
    formGroup.controls.observations.setValue(productOrService.item.observations);
    formGroup.controls.visibility.setValue(productOrService.item.visibility);
    formGroup.controls.description.setValue(productOrService.item.description);
    formGroup.controls.typeDeficiency.setValue(productOrService.item.typeDeficiency);
    formGroup.controls.sex.setValue(productOrService.item.sex);
    formGroup.controls.isForPregnant.setValue(productOrService.item.isForPregnant);
    formGroup.controls.image1.setValue(productOrService.item.image1);
    formGroup.controls.image2.setValue(productOrService.item.image2);
    formGroup.controls.image3.setValue(productOrService.item.image3);
    formGroup.controls.itemFile1.setValue(productOrService.item.itemFile1);
    formGroup.controls.itemFile2.setValue(productOrService.item.itemFile2);
    formGroup.controls.itemFile3.setValue(productOrService.item.itemFile3);
    this.setOperationDays(formGroup, productOrService.item.daysToOperations);
    this.setAges(formBuilder, formGroup, productOrService.item.age);
    if (productOrService.legalPermissions)
      this.setLegalPermissions(formBuilder, formGroup, productOrService.legalPermissions);
    if (productOrService.addresses)
      this.setAddresses(formBuilder, formGroup, productOrService.addresses);
    if (productOrService.typesAttention)
      this.setTypesAttention(formBuilder, formGroup, productOrService.typesAttention);
    if (productOrService.certificates)
      this.setCertificates(formBuilder, formGroup, productOrService.certificates);
  }

  setOperationDays(formGroup: FormGroup, operationDays: any) {
    const day = this.setOperationDaysFormat(operationDays);
    let daysToOperationGroup = formGroup.controls.daysToOperation as FormGroup;
    daysToOperationGroup.controls.monday.setValue(day[0].isOperate);
    daysToOperationGroup.controls.tuesday.setValue(day[1].isOperate);
    daysToOperationGroup.controls.wednesday.setValue(day[2].isOperate);
    daysToOperationGroup.controls.thursday.setValue(day[3].isOperate);
    daysToOperationGroup.controls.friday.setValue(day[4].isOperate);
    daysToOperationGroup.controls.saturday.setValue(day[5].isOperate);
    daysToOperationGroup.controls.sunday.setValue(day[6].isOperate);
  }

  public setOperationDaysFormat(daysToOperation: any): any {
    let operationDays = [];
    if (!daysToOperation[0].isOperate) {
      const day = {
        day: '',
        isOperate: false
      };
      for (let index = 0; index < this.config.NUMBER_DAYS; index++) {
        operationDays.push(day);
      }
    } else {
      operationDays = daysToOperation;
    }
    return operationDays;
  }

  setAges(formBuilder: FormBuilder, formGroup: FormGroup, ages: any) {
    if (ages.length > 0) {
      let ageArray = formGroup.controls.ages as FormArray;
      for (let index = 0; index < ages.length; index++) {
        this.addAgeField(formBuilder, formGroup);
        let ageGroup = ageArray.controls[index] as FormGroup;
        ageGroup.controls.age.setValue(ages[index].age);
      }
    } else {
      this.addAgeField(formBuilder, formGroup);
    }
  }

  setLegalPermissions(formBuilder: FormBuilder, formGroup: FormGroup, legalPermissions: any) {
    if (legalPermissions.length > 0) {
      let legalPermissionArray = formGroup.controls.legalPermissions as FormArray;
      for (let index = 0; index < legalPermissions.length; index++) {
        this.addLegalPermissionField(formBuilder, formGroup, legalPermissions);
        let legalPermissionGroup = legalPermissionArray.controls[index] as FormGroup;
        legalPermissionGroup.controls.legalPermission.setValue(
          legalPermissions[index].legalPermission.idPk
        );
      }
    } else {
      this.addLegalPermissionField(formBuilder, formGroup, legalPermissions);
    }
  }

  setAddresses(formBuilder: FormBuilder, formGroup: FormGroup, addresses: any) {
    if (addresses.length > 0) {
      let addressArray = formGroup.controls.addresses as FormArray;
      for (let index = 0; index < addresses.length; index++) {
        this.addAddressField(formBuilder, formGroup, addresses);
        let addressGroup = addressArray.controls[index] as FormGroup;
        addressGroup.controls.address.setValue(addresses[index].address.idPk);
      }
    } else {
      this.addAddressField(formBuilder, formGroup, addresses);
    }
  }

  setTypesAttention(formBuilder: FormBuilder, formGroup: FormGroup, typesAttention: any) {
    if (typesAttention.length > 0) {
      let typeAttentionArray = formGroup.controls.typesAttention as FormArray;
      for (let index = 0; index < typesAttention.length; index++) {
        this.addTypeAtentionField(formBuilder, formGroup, typesAttention);
        let typeAttentionGroup = typeAttentionArray.controls[index] as FormGroup;
        typeAttentionGroup.setValue({
          typeAttention: typesAttention[index].typeAttention.idPk,
          costDelivery: typesAttention[index].cost ? typesAttention[index].cost : 0
        });
      }
    } else {
      this.addTypeAtentionField(formBuilder, formGroup, typesAttention);
    }
  }

  setCertificates(formBuilder: FormBuilder, formGroup: FormGroup, certificates: any) {
    if (certificates.length > 0) {
      let certificateArray = formGroup.controls.certificates as FormArray;
      for (let index = 0; index < certificates.length; index++) {
        this.addCertificateField(formBuilder, formGroup);
        let certificateGroup = certificateArray.controls[index] as FormGroup;
        certificateGroup.controls.idPk.setValue(certificates[index].certificate.idPk);
        certificateGroup.controls.name.setValue(certificates[index].certificate.name);
        certificateGroup.controls.description.setValue(certificates[index].certificate.description);
        certificateGroup.controls.expirationDate.setValue(
          certificates[index].certificate.expirationDate.slice(0, 10)
        );
      }
    } else {
      this.addCertificateField(formBuilder, formGroup);
    }
  }

  addressFormat(addresses: any) {
    const address = {
      itemAddresses: addresses
    };
    return address;
  }

  typeAttentionFormat(typesAttentions: any) {
    const typeAttention = {
      itemTypesAttention: typesAttentions
    };
    return typeAttention;
  }

  certificateFormat(certificates: any) {
    const certificate = {
      itemCertificates: certificates
    };
    return certificate;
  }

  legalPermissionFormat(legalPermissions: any) {
    const legalPermission = {
      itemLegalPermissions: legalPermissions
    };
    return legalPermission;
  }

  resetImage(formGroup: FormGroup, type: number) {
    if (type === 1) {
      formGroup.controls.image1.setValue('');
    } else if (type === 2) {
      formGroup.controls.image2.setValue('');
    } else {
      formGroup.controls.image3.setValue('');
    }
  }

  convertDayOperationToArray(days: any) {
    let daysFormat = [];

    Object.keys(days).map((key) => {
      let dayOperation = {
        day: '',
        isOperate: false
      };
      if (key === 'monday' && days[key]) {
        dayOperation.day = 'monday';
        dayOperation.isOperate = days[key];
      } else if (key === 'tuesday' && days[key]) {
        dayOperation.day = 'tuesday';
        dayOperation.isOperate = days[key];
      } else if (key === 'wednesday' && days[key]) {
        dayOperation.day = 'wednesday';
        dayOperation.isOperate = days[key];
      } else if (key === 'thursday' && days[key]) {
        dayOperation.day = 'thursday';
        dayOperation.isOperate = days[key];
      } else if (key === 'friday' && days[key]) {
        dayOperation.day = 'friday';
        dayOperation.isOperate = days[key];
      } else if (key === 'saturday' && days[key]) {
        dayOperation.day = 'saturday';
        dayOperation.isOperate = days[key];
      } else if (key === 'sunday' && days[key]) {
        dayOperation.day = 'sunday';
        dayOperation.isOperate = days[key];
      }
      daysFormat.push(dayOperation);
    });

    return daysFormat;
  }

  cleanDaysOperationObj(daysOperation: any) {
    let days = [];

    daysOperation.map((dayOperation: any) => {
      let day = '';
      if (dayOperation.day === 'monday' && dayOperation.isOperate) {
        day = 'Lunes';
        days.push(day);
      } else if (dayOperation.day === 'tuesday' && dayOperation.isOperate) {
        day = 'Martes';
        days.push(day);
      } else if (dayOperation.day === 'wednesday' && dayOperation.isOperate) {
        day = 'Miércoles';
        days.push(day);
      } else if (dayOperation.day === 'thursday' && dayOperation.isOperate) {
        day = 'Jueves';
        days.push(day);
      } else if (dayOperation.day === 'friday' && dayOperation.isOperate) {
        day = 'Viernes';
        days.push(day);
      } else if (dayOperation.day === 'saturday' && dayOperation.isOperate) {
        day = 'Sábado';
        days.push(day);
      } else if (dayOperation.day === 'sunday' && dayOperation.isOperate) {
        day = 'Domingo';
        days.push(day);
      }
    });
    return days;
  }

  getOrganization(id: any) {
    let params = new URLSearchParams();
    params.set('userId', id);
    this.requestOptions.search = params;
    return this.http
      .get(
        `${this.appConfig.API_ENDPOINT_SICID}Organizations/getOrganizationApprovedByUser`,
        this.requestOptions
      )
      .toPromise()
      .then(
        (response: Response) => Promise.resolve(response.json()),
        (err) => Promise.reject(err)
      );
  }

  postItemVisibility(idItem: number, visibilityCondition: boolean) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http
      .post(
        `${this.appConfig.API_ENDPOINT_CATALOG}Items/postVisibility`,
        {
          idItem: idItem,
          visibilityCondition: visibilityCondition
        },
        options
      )
      .toPromise()
      .then((response: Response) => response.json())
      .catch((err: any) => Promise.reject(err));
  }

  warningElementNotAllow(
    dropDownList: any,
    formGroup: FormGroup,
    formGroupName: string,
    controlName: string
  ) {
    return this.applyReviewDuplicateElements(dropDownList, formGroup, formGroupName, controlName);
  }

  applyReviewDuplicateElements(
    dropDownList: any,
    formGroup: FormGroup,
    formGroupName: string,
    controlName: string
  ) {
    let formArray = formGroup.controls[formGroupName] as FormArray;

    for (let i = 0; i < formArray.controls.length; i++) {
      let count = 0;
      for (let j = 0; j < formArray.controls.length; j++) {
        let firstGroupCompare = formArray.controls[i] as FormGroup;
        let secondGroupCompare = formArray.controls[j] as FormGroup;
        let firstElementCompare = +firstGroupCompare.controls[controlName].value;
        let secondElementCompare = +secondGroupCompare.controls[controlName].value;

        if (firstElementCompare === secondElementCompare) {
          count++;
        }
      }
      if (count >= 2) {
        this.displayDropDownSelected(dropDownList, controlName, false);
        return this.isDropDownValid(dropDownList);
      } else {
        this.displayDropDownSelected(dropDownList, controlName, true);
      }
    }
    return this.isDropDownValid(dropDownList);
  }

  displayDropDownSelected(dropDownList: any, controlName: string, isValid: boolean) {
    dropDownList.map((dropDown) => {
      if (dropDown.name === controlName) {
        dropDown.isValid = isValid;
      }
    });
  }

  isDropDownValid(dropDowns: any) {
    let isValid = false;
    for (let index = 0; index < dropDowns.length; index++) {
      if (dropDowns[index].isValid) {
        isValid = true;
      } else {
        isValid = false;
        break;
      }
    }
    return isValid;
  }
}
export {ItemService};
