import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganizationService } from '../../organization.service';
import { SharedService } from '../../../../shared/shared.service';

@Component({
  selector: 'app-organization-search-region',
  templateUrl: './organizations-search-by-regions.component.html',
  styleUrls: [
    './organizations-search-by-regions.component.scss',
    '../../../common/styles/style.scss'
  ],
  providers: [OrganizationService]
})
class OrganizationSearchRegionComponent implements OnInit {

  public provinces: any;
  public cantons: any;
  public districts: any;
  public districtName: any;
  public province: number;
  public canton: number;
  public district: number;
  public disable: boolean;

  constructor(
    private organizationService: OrganizationService,
    private sharedService: SharedService,
    private _route: ActivatedRoute,
    private router: Router
  ) {
    this.provinces = [];
    this.cantons = [];
    this.districts = [];
    this.districtName = [];
    this.province = 0;
    this.canton = 0;
    this.district = 0;
    this.disable = true;
  }

  ngOnInit() {
    this.organizationService.getProvinces()
      .then(this.handleProvince.bind(this))
      .catch((err) => Promise.reject(err));
  }

  getCantons() {
    this.cantons = [];
    this.districts = [];
    this.canton = 0;
    this.organizationService.getCantons(String(this.province))
      .then(this.handleCantons.bind(this))
      .catch((err) => Promise.reject(err));
  }

  getDistricts() {
    this.districts = [];
    this.district = 0;
    this.organizationService.getDistricts(String(this.canton))
      .then(this.handleDistricts.bind(this))
      .catch((err) => Promise.reject(err));
  }

  searchByRegions() {
    this.sharedService.setRegionOrganizationToSearch(this.province,this.canton,this.district);
    this.router.navigate(['organization-result'],{relativeTo : this._route.parent});
  }

  handleProvince(response: any) {
    this.provinces = response;
  }

  handleCantons(response: any) {
    this.cantons = response;
    this.disable = false;
  }

  handleDistricts(response: any) {
    this.districts = response;
  }

}
export { OrganizationSearchRegionComponent }
