import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemsService } from '../items.service';
import { ProductService } from '../item/product/product.service';

@Component({
  selector: 'app-item-product-inspect',
  templateUrl: './item-inspect-product.component.html',
  styleUrls: [
    './item-inspect-product.component.scss',
    '../../common/styles/style.scss'
  ],
  providers: [
    ItemsService,
    ProductService
  ]
})

class ItemProductInspectComponent implements OnInit {

  public productDetail: any;
  public roleId: number;
  public descriptionReject: string;
  public itemId : number;
  public userId : number;
  public titleModalConfirmation: string;
  public bodyModalConfirmation: string;
  public isAcceptingUser: boolean;

  constructor(
    private _itemsService: ItemsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService
  ) {
    this.productDetail = {};
    this.roleId = +localStorage.getItem('rolId');
    this.descriptionReject = '';
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.itemId = +params.itemIdPk;
    });
    this.activatedRoute.params.subscribe(params => {
      this.userId = +params.userIdPk;
    });
  }

  handleInspectProduct(response: any) {
    this.productDetail = response.product;
  }

  acceptItem() {
    this.isAcceptingUser = true;
    this.titleModalConfirmation = '¿Aceptar?';
    this.bodyModalConfirmation = '¿Desea aprobar el producto?';
  }

  rejectItem() {
    this.isAcceptingUser = false;
    this.titleModalConfirmation = '¿Rechazar?';
    this.bodyModalConfirmation = '¿Desea rechazar el producto?';
    if (this.descriptionReject === '') {
      this.descriptionReject = 'Producto rechazado por el administrador';
    }
  }

  deleteProduct() {
    this._itemsService.postDeleteItem(this.itemId, this.userId);
  }

  executeInspection(event: any) {
    if(this.isAcceptingUser) {
      this._itemsService.postItemInspection(this.itemId, this.userId);
    } else {
      this._itemsService.postItemInspection(this.itemId, this.userId, this.descriptionReject);
    }
    this.router.navigate(['catalog/page-dashboard/item/item-list']);
  }

  backToList() {
    this.router.navigate(['/catalog/page-dashboard']);
  }

}
export { ItemProductInspectComponent }
