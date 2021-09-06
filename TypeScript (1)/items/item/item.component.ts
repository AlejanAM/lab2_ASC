import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrganizationService } from '../../organizations/organization.service';

@Component({
  selector: 'app-item-no-approved',
  templateUrl: './item.component.html',
  styleUrls: [
    './item.component.scss',
    '../../common/styles/style.scss'
  ],
  providers: [OrganizationService]
})
class ItemComponent implements OnInit {

  @Input() item: {
    idPk: number,
    code: string,
    name: string,
    description: string,
    onDateCreated: string,
    onDateUpdated: string,
    image1: any,
    organizationsIdFk: number
  };

  public organizationDetail: any;

  constructor(
    public _route: Router,
    private routeActivated: ActivatedRoute,
    private organizationService: OrganizationService
  ) { }

  ngOnInit() {
    const organizationId = this.item.organizationsIdFk;
    this.organizationService.getOrganizationDetail(organizationId)
      .then(this.handleGetOrganization.bind(this));
  }

  handleGetOrganization(response: any) {
    this.organizationDetail = response.organization.details;
  }
}
export { ItemComponent }
