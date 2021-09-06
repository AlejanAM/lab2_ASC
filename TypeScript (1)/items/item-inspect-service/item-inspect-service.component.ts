import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ItemsService } from '../items.service';
import { ServiceService } from '../item/service/service.service';

@Component({
  selector: 'app-item-service-inspect',
  templateUrl: './item-inspect-service.component.html',
  styleUrls: [
    './item-inspect-service.component.scss',
    '../../common/styles/style.scss'
  ],
  providers: [
    ItemsService,
    ServiceService
  ]
})
class ItemServiceInspectComponent implements OnInit {

  public serviceDetail: any;
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
    private serviceService: ServiceService
  ) {
    this.serviceDetail = {};
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

  handleInspectService(response: any) {
    this.serviceDetail = response.service;
  }

  acceptItem() {
    this.isAcceptingUser = true;
    this.titleModalConfirmation = '¿Aceptar?';
    this.bodyModalConfirmation = '¿Desea aprobar el servicio?';
  }

  rejectItem() {
    this.isAcceptingUser = false;
    this.titleModalConfirmation = '¿Rechazar?';
    this.bodyModalConfirmation = '¿Desea rechazar el servicio?';
    if (this.descriptionReject == '') {
      this.descriptionReject = 'Servicio rechazado por el administrador';
    }
  }

  executeInspection(event: any) {
    if(this.isAcceptingUser) {
      this._itemsService.postItemInspection(this.itemId, this.userId);
    } else {
      this._itemsService.postItemInspection(this.itemId, this.userId, this.descriptionReject);
    }
    this.router.navigate(['catalog/page-dashboard/item/item-list']);
  }

  deleteService() {
    this._itemsService.postDeleteItem(this.itemId, this.userId);
  }

  backToList() {
    this.router.navigate(['/catalog/page-dashboard']);
  }

}
export { ItemServiceInspectComponent }
