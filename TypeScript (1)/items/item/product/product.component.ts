import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ItemService } from '../item.service';
import { ItemsService } from '../../items.service';
import { ProductService } from './product.service';
import { CoreConstants } from '../../../../core/core.constants';
import { OrganizationService } from '../../../organizations/organization.service';
import { SharedService } from '../../../../shared/shared.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.scss',
    '../../../common/styles/style.scss'
  ],
  providers: [
    ProductService,
    OrganizationService,
    ItemsService,
    CoreConstants
  ]
})
class ProductComponent implements OnInit {

  @Input() selectedChildState: number;

  public itemsApproved: any;
  public itemsNoApproved: any;
  public itemsPending: any;
  public organizationsUser: any;
  public itemsToDeleteApproved : any;
  public itemsToDeleteNoApproved : any;
  public visibilityItems: any;
  public organizationSelected: number;
  public organization: any;
  public userId: number;
  public rolId: number;
  public isDeletingApproved :boolean;

  constructor(
    private productService: ProductService,
    private itemService: ItemService,
    private itemsService : ItemsService,
    private organizationService: OrganizationService,
    private router: Router,
    private _route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.itemsApproved = [];
    this.itemsNoApproved = [];
    this.itemsPending = [];
    this.visibilityItems = [];
    this.organizationsUser = [];
    this.itemsToDeleteApproved = [];
    this.itemsToDeleteNoApproved = [];
    this.organizationSelected = null;
    this.isDeletingApproved = null;
  }

  ngOnInit() {
    this.rolId = Number(localStorage.getItem('rolId'));
    this.userId = Number(localStorage.getItem('userId'));
    if (this.rolId === 1) {
      this.itemsService.getItems(this.sharedService.getModeConsultantItems().value,true)
        .then(this.handleShowProducts.bind(this))
        .catch(this.catchShowProductsError);
    } else if (this.rolId === 2) {
      this.itemService.getOrganization(this.userId)
        .then(this.handleOrganizationsUser.bind(this))
        .catch(this.catchShowProductsError);
    }
  }

  handleOrganizationsUser(response: any) {
    this.organizationsUser = response.organizations;
  }

  selectOrganization() {
    this.itemsApproved = [];
    this.itemsNoApproved = [];
    this.itemsPending = [];
    this.visibilityItems = [];
    this.itemService.getItems(this.organizationSelected,this.sharedService.getModeConsultantItems().value, !CoreConstants.IS_PRODUCT)
      .then(this.handleShowProducts.bind(this))
      .then(this.getOrganizationById.bind(this))
      .then(this.handleGetOrganization.bind(this))
      .catch(this.catchShowProductsError);
  }

  handleShowProducts(response: any) {
    let items = response;
    items.map((item) => {
      if (item.isApproved && item.isChecked) {
        this.itemsApproved.push(item);
        this.visibilityItems[item.idPk] = item.visibility;
      } else if (!item.isApproved && !item.isChecked) {
        this.itemsNoApproved.push(item);
      } else if (!item.isApproved && item.isChecked) {
        this.itemsPending.push(item);
      }
    });
    return Promise.resolve();
  }

  getOrganizationById() {
    return this.organizationService.getOrganizationDetail(this.organizationSelected);
  }

  handleGetOrganization(response: any) {
    this.organization = response.organization.details;
  }

  catchShowProductsError(err: any) {
    console.log(err);
  }

  showProduct(item: any) {
    if (this.rolId === 1) {
      this.router.navigate(['/item-product-inspect', this.userId, item]);
    } else if (this.rolId === 2) {
      this.router.navigate(['/show-product', item, this.organizationSelected, this.userId]);
    }
  }

  createProduct() {
    this.router.navigate(['create-product', this.organizationSelected, this.userId], {
      relativeTo: this._route.parent
    });
  }

  updateVisibility(itemId?: number) {
    this.visibilityItems[itemId] = !this.visibilityItems[itemId];
    this.itemService.postItemVisibility(itemId, this.visibilityItems[itemId]);
  }

  editProduct(itemId: number) {
    this.router.navigate(['/update-product', itemId, this.organization.idPk, this.userId]);
  }

  deleteItem(itemId: number) {
    this.itemsService.postDeleteItem(itemId, this.userId);
  }

  acceptItem(idItem: number) {
    this.itemsService.postItemInspection(idItem);
    let itemEvaluated = this.itemsPending.find(x => x.idPk === idItem);
    this.itemsApproved.push(itemEvaluated);
    this.itemsPending = this.itemsPending.filter(x => x.idPk !== idItem);
  }

  rejectItem(idItem: number) {
    this.itemsService.postItemInspection(idItem,null,'Item rechazado por el administrador.');
    let itemEvaluated = this.itemsPending.find(x => x.idPk === idItem);
    this.itemsNoApproved.push(itemEvaluated);
    this.itemsPending = this.itemsPending.filter(x => x.idPk !== idItem);
  }

  addItemToDeleteApproved(idItem: number){
    if (this.itemsToDeleteApproved.find(item => item === idItem) === undefined) {
      this.itemsToDeleteApproved.push(idItem);
    } else {
      this.itemsToDeleteApproved = this.itemsToDeleteApproved.filter(item => item !== idItem);
    }
  }

  addItemToDeleteNoApproved(idItem: number) {
    if (this.itemsToDeleteNoApproved.find(item => item === idItem) === undefined) {
      this.itemsToDeleteNoApproved.push(idItem);
    } else {
      this.itemsToDeleteNoApproved = this.itemsToDeleteNoApproved.filter(item => item !== idItem);
    }
  }

  deletingApproved() {
    this.isDeletingApproved = true;
  }

  deletingNoApproved() {
      this.isDeletingApproved = false;
  }

  deleteItems() {
    if(this.isDeletingApproved) {
      for (let item = 0;item < this.itemsToDeleteApproved.length; item++) {
        this.itemsApproved = this.itemsApproved.filter(x => x.idPk !== this.itemsToDeleteApproved[item]);
      }
      this.itemsService.deleteManyItems(this.itemsToDeleteApproved);
    } else {
      this.itemsService.deleteManyItems(this.itemsToDeleteNoApproved);
      for (let item = 0;item < this.itemsToDeleteNoApproved.length; item++) {
        this.itemsNoApproved = this.itemsNoApproved.filter(x => x.idPk !== this.itemsToDeleteNoApproved[item]);
      }
    }
  }

}
export { ProductComponent }
