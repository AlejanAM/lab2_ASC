import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ISubscription } from "rxjs/Subscription";

import { ItemService } from '../item/item.service';
import { ItemsService } from '../items.service';
import { CoreConstants } from '../../../core/core.constants';
import { SharedService } from '../../../shared/shared.service';
import { OrganizationService } from '../../organizations/organization.service';
import { BreadcrumbService } from '../../../shared/breadcrumb.service'

@Component({
  selector: 'app-items-state',
  templateUrl: './item-state.component.html',
  styleUrls: [
    './item-state.component.scss',
    '../../common/styles/style.scss'
  ],
  providers: [
    ItemsService,
    CoreConstants,
    OrganizationService
  ]
})
class ItemsStateComponent implements OnInit, OnDestroy{

  public modeConsultant: number;
  public modeConsultantPending: number;
  public modeConsultantAccepted: number;
  public modeConsultantRejected: number;
  public userId: number;
  public rolId: number;
  public organizationSelected: number;
  public isAdministrator: boolean;
  public isConsultantProduct: boolean;
  public isNotResult: boolean;
  public titleModeConsultant: string;
  public titleModalConfirmation: string;
  public bodyModalConfirmation: string;
  public items: any;
  public organizationsUser: any;
  public itemsToDelete : any;
  public organization: any;
  public page: any;
  private idItemInspection: number;
  private isApprovingInspection: boolean;
  public modeConsultantSubscription: ISubscription;
  public itemToSearch: string;

  constructor(
    private sharedService: SharedService,
    private itemsService: ItemsService,
    private itemService: ItemService,
    private router: Router,
    private _route: ActivatedRoute,
    private organizationService: OrganizationService,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.titleModeConsultant = (this.isConsultantProduct) ? 'Productos' : 'Servicios';
    this.organizationSelected = 0;
    this.isAdministrator = false;
    this.isNotResult = false;
    this.items = [];
    this.organizationsUser = [];
    this.itemsToDelete = [];
    this.organization = [];
    this.modeConsultantPending = 1;
    this.modeConsultantAccepted = 2;
    this.modeConsultantRejected = 3;
    this.subscribeEnvents();
  }

  ngOnInit() {
    this.rolId = +localStorage.getItem('rolId');
    this.userId = +localStorage.getItem('userId');
    this.isAdministrator = (this.rolId === CoreConstants.rolAdministrator) ? true : false;
    if (this.rolId === CoreConstants.rolAdministrator) {
      this.itemsService.getItems(this.modeConsultant, this.isConsultantProduct)
        .then(this.handleShowProducts.bind(this))
        .catch(this.catchHttpError);
    } else if (this.rolId === CoreConstants.rolEditor) {
      this.itemService.getOrganization(this.userId)
        .then(this.handleOrganizationsUser.bind(this))
        .catch(this.catchHttpError);
    }
  }

  ngOnDestroy() {
    if(this.modeConsultantSubscription) {
      this.modeConsultantSubscription.unsubscribe();
    }
  }

  subscribeEnvents() {
    this.modeConsultantSubscription = this.sharedService.getModeConsultantItems()
      .subscribe((modeToConsultItems)=>{
        this.organizationSelected = null;
        this.itemToSearch = '';
        this.items = [];
        this.modeConsultant = modeToConsultItems;
        this.isConsultantProduct = this.sharedService.getIsConsultantProduct();
        this.titleModeConsultant = (this.isConsultantProduct) ? 'Productos' : 'Servicios';
        this.buildBreadCrumb(this.modeConsultant);
        if (this.rolId === CoreConstants.rolAdministrator) {
          this.itemsService.getItems(this.modeConsultant,this.isConsultantProduct)
            .then(this.handleShowProducts.bind(this))
            .catch(this.catchHttpError);
        }
      });
  }

  /**
   * Build the breadcrumb array based on the mode of view
   * @param modeConsultant 
   */
  buildBreadCrumb(modeConsultant) {
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/catalog/page-dashboard'
    });
    switch (modeConsultant) {
      case 1:
        this.breadcrumbService.addBreadCrumb({
          page: `${this.titleModeConsultant} Pendientes`,
          href: '/#/catalog/page-dashboard/item/item-list'
        });
      break;
      case 2:
        this.breadcrumbService.addBreadCrumb({
          page: `${this.titleModeConsultant} Aprobados`,
          href: '/#/catalog/page-dashboard/item/item-list'
        });
      break;
      case 3:
        this.breadcrumbService.addBreadCrumb({
          page: `${this.titleModeConsultant} Rechazados`,
          href: '/#/catalog/page-dashboard/item/item-list'
        });
      break;
      default:
        break;
    }
  }

  buildComponent() {
    this.rolId = +localStorage.getItem('rolId');
    this.userId = +localStorage.getItem('userId');
    this.isAdministrator = (this.rolId === CoreConstants.rolAdministrator)? true : false;
    if (this.rolId === CoreConstants.rolAdministrator) {
      this.itemsService.getItems(this.modeConsultant, this.isConsultantProduct)
        .then(this.handleShowProducts.bind(this))
        .catch(this.catchHttpError);
    } else if (this.rolId === CoreConstants.rolEditor) {
      this.itemService.getOrganization(this.userId)
        .then(this.handleOrganizationsUser.bind(this))
        .catch(this.catchHttpError);
    }
  }

  selectOrganization() {
    this.items = [];
    this.itemService.getItems(this.organizationSelected, this.modeConsultant, this.isConsultantProduct)
      .then(this.handleShowProducts.bind(this))
      .then(this.getOrganizationById.bind(this))
      .then(this.handleGetOrganization.bind(this))
      .catch(this.catchHttpError);
  }

  getOrganizationById() {
    return this.organizationService.getOrganizationDetail(this.organizationSelected);
  }

  handleOrganizationsUser(response: any) {
    this.organizationsUser = response.organizations;
  }

  handleShowProducts(response: any) {
    if (response.length == 0) {
      this.isNotResult = true;
    } else {
      this.isNotResult = false;
    }
    let items = response;
    items.map((item) => {
      this.items.push(item);
    });
    return Promise.resolve();
  }

  catchHttpError(err: any) {
    console.log(err);
  }

  showProduct(item: any) {
    if (this.isAdministrator) {
      if (this.isConsultantProduct) {
        this.router.navigate(['item-product-inspect', this.userId, item], {
          relativeTo: this._route.parent
        });
      } else {
        this.router.navigate(['item-service-inspect', this.userId, item], {
          relativeTo: this._route.parent
        });
      }
    } else if (!this.isAdministrator) {
      if(this.isConsultantProduct){
        this.router.navigate(['show-product', item, this.organizationSelected, this.userId],{relativeTo : this._route.parent});
      } else {
        this.router.navigate(['show-service', item, this.organizationSelected, this.userId],{relativeTo : this._route.parent});
      }
    }
  }

  editProduct(itemId: number) {
    if(this.isConsultantProduct) {
      this.router.navigate(['update-product', itemId, this.organization.idPk, this.userId],{relativeTo : this._route.parent});
    } else {
      this.router.navigate(['update-service', itemId, this.organization.idPk, this.userId],{relativeTo : this._route.parent});
    }
  }

  acceptItem(idItem: number) {
    this.idItemInspection = idItem;
    this.isApprovingInspection = true;
    this.titleModalConfirmation = '¿Aceptar?';
    this.bodyModalConfirmation = (this.isConsultantProduct) ? '¿Desea aprobar el producto?' : '¿Desea aprobar el servicio?';

  }

  rejectItem(idItem: number) {
    this.idItemInspection = idItem;
    this.isApprovingInspection = false;
    this.titleModalConfirmation = '¿Rechazar?';
    this.bodyModalConfirmation = (this.isConsultantProduct) ? '¿Desea rechazar el producto?' : '¿Desea rechazar el servicio?';

  }

  executeInspection(stateInspection: any) {
    if(stateInspection) {
      if(this.isApprovingInspection){
        this.itemsService.postItemInspection(this.idItemInspection);
      } else {
        this.itemsService.postItemInspection(this.idItemInspection,null,'Item rechazado por el administrador.');
      }
      this.items = this.items.filter(x => x.idPk !== this.idItemInspection);
    }
  }

  addItemToDelete(idItem: number) {
    if (this.itemsToDelete.find(item => item === idItem) === undefined) {
      this.itemsToDelete.push(idItem);
    } else {
      this.itemsToDelete = this.itemsToDelete.filter(item => item !== idItem);
    }
  }

  handleGetOrganization(response: any) {
    this.organization = response.organization.details;
  }

  public handleItemsDeleted(itemsDeleted: any): void {
    for (let item = 0;item < itemsDeleted.length; item++) {
      this.items = this.items.filter(x => x.idPk !== itemsDeleted[item]);
    }
  }

  getItemToSearch(event: any) {
    this.itemToSearch = event;
  }

}
export { ItemsStateComponent }
