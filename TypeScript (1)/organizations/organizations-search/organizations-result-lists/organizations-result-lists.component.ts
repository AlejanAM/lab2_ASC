import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { OrganizationService } from '../../../organizations/organization.service';
import { CoreConstants } from '../../../../core/core.constants';
import { SharedService } from '../../../../shared/shared.service';
import { BreadcrumbService } from '../../../../shared/breadcrumb.service'

@Component({
  selector: 'app-page-result-list',
  templateUrl: './organizations-result-lists.component.html',
  styleUrls: [
    './organizations-result-lists.component.scss',
    '../../../common/styles/style.scss'
  ],
  providers: [OrganizationService]
})
class OrganizationResulListComponent {

  public organizationsFound: any;
  public searchConfiguration: any;
  public isNotResult: boolean;
  public page: any;
  private entityRole: number;

  constructor(
    private _route: Router,
    private activatedRoute: ActivatedRoute,
    private organizationsService: OrganizationService,
    private sharedService: SharedService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.searchConfiguration = [];
    this.isNotResult = false;
    this.entityRole = 2;
  }

  ngOnInit() {
    this.sharedService.getOrganizationsToSearch().subscribe((searchDetail) => { this.searchConfiguration = searchDetail; });
    if (this.searchConfiguration.isSearchWord) {
      this.getSearchedByWord(this.searchConfiguration.word);
    } else {
      this.getOrganizationsByRegion(this.searchConfiguration.province,this.searchConfiguration.canton,this.searchConfiguration.district);
    }
    this.breadcrumbService.addBreadCrumb({
      page: 'Resultados',
      href: `/#${this.activatedRoute.snapshot['_routerState'].url}`
    });
  }

  getOrganizationsByRegion(province: number, canton: number, district: number) {
    this.organizationsService.getOrganizationsByRegions(province, canton, district, this.entityRole)
      .then(this.handleOrganizationsSearched.bind(this))
      .catch((err) => Promise.reject(err));
  }

  getSearchedByWord(name: string) {
    this.organizationsService.getOrganizationsBySearchWord(name, this.entityRole)
      .then(this.handleOrganizationsSearched.bind(this))
      .catch((err) => Promise.reject(err));
  }

  handleOrganizationsSearched(response: any) {
    if (response.length == 0) {
      this.isNotResult = true;
    } else {
      this.isNotResult = false;
    }
    this.organizationsFound = response;
  }

  showOrganization(idOrganization: number){
    this._route.navigate(['organization-view', idOrganization],{relativeTo : this.activatedRoute.parent});
  }

}
export { OrganizationResulListComponent }
