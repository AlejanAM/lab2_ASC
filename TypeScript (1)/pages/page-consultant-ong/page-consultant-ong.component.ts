import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { OrganizationService } from '../../organizations/organization.service';
import { CoreConstants } from '../../../core/core.constants';
import { SharedService } from '../../../shared/shared.service';
import { BreadcrumbService } from '../../../shared/breadcrumb.service'

@Component({
  selector: 'app-page-consultant',
  templateUrl: './page-consultant-ong.component.html',
  styleUrls: ['../../common/styles/style.scss'],
  providers: [OrganizationService]
})
class PageConsultantONGComponent {

  public organizationsFound: any;
  public isProduct: boolean;
  public showOrganizations: boolean;
  public page: number;
  public orgBreadCrumb: string;
  public organizationSearchByRegionBreadCrumb: string;
  public organizationSearchByWordBreadCrumb: string;
  public principalPageSICID: string;
  public principalPageSICIDCatalog: string;
  public principalPageSICIDCatalogAngular: string;
  public itemBreadCrumb: any;
  private entityRole: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private organizationsService: OrganizationService,
    private sharedService: SharedService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.principalPageSICID = CoreConstants.PATH_URL_SICID;
    this.principalPageSICIDCatalog = CoreConstants.PATH_URL_SICID_Catalog;
    this.principalPageSICIDCatalogAngular = CoreConstants.PATH_URL_SICID_Catalog_Angular;
    this.showOrganizations = false;
    this.organizationSearchByWordBreadCrumb = null;
    this.organizationSearchByRegionBreadCrumb = null;
    this.page = 1;
    this.itemBreadCrumb = [];
    this.entityRole = 3;
    this.breadcrumbService.breadCrumbArray.subscribe(response => {
      this.itemBreadCrumb = response;
    });
    this.addBreadcrumb();
  }

  /**
   * Add the routes for the breadcrumb array based on the type of view
   */
  addBreadcrumb() {
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/home/welcome'
    });
  }

  logIn() {
    this.router.navigate(['/']);
  }

  showLoginButton() {
    const userId = localStorage.getItem('userId');
    return (userId !== null);
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
    this.organizationsFound = response;
  }

  handleShowState(event: any) {
    this.showOrganizations = event.show;
    if (event.type === 0) {
      this.organizationSearchByRegionBreadCrumb = event.name;
      this.getOrganizationsByRegion(event.province, event.canton, event.district);
    } else if (event.type === 1) {
      this.organizationSearchByWordBreadCrumb = event.name;
      this.getSearchedByWord(event.name);
    }
  }

  showOrganization(organization: any) {
    this.router.navigate(['organization-view', organization]);
  }

}
export { PageConsultantONGComponent }
