import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {
  DEFAULT_MESSAGE,
  DEFAULT_TITLE,
  ONG_STATE_MESSAGE,
  ROLES_STATE_MESSAGE,
} from '../pages.constants';
import {CoreConstants} from '../../../core/core.constants';
import {SharedService} from '../../../shared/shared.service';
import {BreadcrumbService} from '../../../shared/breadcrumb.service';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './page-dashboard.component.scss',
    '../../common/styles/style.scss',
  ],
  providers: [SharedService],
})
class PageDashBoardComponent implements OnInit {
  public isActive: boolean;
  public selectedFatherIndex: number;
  public selectedChildIndex: number;
  public isEntitySelected: boolean;
  public isRoleSelected: boolean;
  public isProductSelected: boolean;
  public isServiceSelected: boolean;
  public isDefaultActivate: boolean;
  public isAdministratorRol: boolean;
  public isReportSelected: boolean;
  public userId: number;
  public message: string;
  public title: string;
  public titleOrganizations: string;
  public ongStateMessages: string[];
  public userStateMessages: string[];
  public ongStates: any;
  public userStates: any;
  public isCatalog: boolean;
  public isShowBreadCrumb: boolean;
  public roleUser: number;
  public itemBreadCrumb: any;

  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private sharedService: SharedService,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.isEntitySelected = true;
    this.isRoleSelected = true;
    this.isProductSelected = true;
    this.isServiceSelected = true;
    this.isDefaultActivate = true;
    this.isReportSelected = true;
    this.isActive = false;
    this.selectedChildIndex = 0;
    this.selectedFatherIndex = 0;
    this.message = DEFAULT_MESSAGE;
    this.title = DEFAULT_TITLE;
    this.ongStateMessages = ONG_STATE_MESSAGE;
    this.userStateMessages = ROLES_STATE_MESSAGE;
    this.titleOrganizations = 'Entidades';
    this.ongStates = {};
    this.userStates = {};
    this.isCatalog = false;
    this.isShowBreadCrumb = false;
    this.itemBreadCrumb = [];
  }

  ngOnInit() {
    this.userId = +localStorage.getItem('userId');
    this.roleUser = +localStorage.getItem('rolId');
    this.isAdministratorRol =
      +localStorage.getItem('rolId') === CoreConstants.roleONGAdministrator ||
      +localStorage.getItem('rolId') === CoreConstants.rolAdministrator
        ? true
        : false;
    this.isCatalog =
      this.roleUser === CoreConstants.rolEditor ||
      this.roleUser === CoreConstants.rolAdministrator
        ? true
        : false;
    this.titleOrganizations = this.isCatalog ? 'Entidades' : 'ONG';
    this.breadcrumbService.breadCrumbArray.subscribe((response) => {
      this.itemBreadCrumb = response;
    });
  }

  showProfile() {
    this.router.navigate(['show-user', this.userId, 1]);
  }

  logOut() {
    localStorage.removeItem('userId');
    localStorage.removeItem('nameUser');
    window.location.href = 'https://www.sicid.go.cr/';
  }

  selectChildState(index: number) {
    this.isShowBreadCrumb = true;
    this.selectedChildIndex = index;
  }

  /**
   * Enables the drop menu depending on the item selected
   * @param element
   */
  enableHorizontalElements(element: number) {
    this.selectedChildIndex = 1;
    this.selectedFatherIndex = element;
    this.isEntitySelected = true;
    this.isRoleSelected = true;
    this.isProductSelected = true;
    this.isServiceSelected = true;
    this.isReportSelected = true;
    switch (element) {
      case 1:
        this.isEntitySelected = !this.isEntitySelected;
        break;
      case 2:
        this.sharedService.setIsConsultantProduct(true);
        this.isProductSelected = !this.isProductSelected;
        break;
      case 3:
        this.sharedService.setIsConsultantProduct(false);
        this.isServiceSelected = !this.isServiceSelected;
        break;
      case 4:
        this.isRoleSelected = !this.isRoleSelected;
        break;
      case 5:
        this.isReportSelected = !this.isReportSelected;
        break;
      case 6:
        this.isReportSelected = !this.isReportSelected;
        break;
      default:
        break;
    }
  }

  handleExistOrganization(event) {
    this.ongStates = event;
  }

  handleExistUser(event) {
    this.userStates = event;
  }

  setParamsItemsConsultant(
    modeConsultant: number,
    isProductConsultant: boolean,
    element: number,
  ) {
    this.isShowBreadCrumb = true;
    this.sharedService.setModeConsultantItems(modeConsultant);
    this.sharedService.setIsConsultantProduct(isProductConsultant);
    this.selectChildState(element);
  }
}
export {PageDashBoardComponent};
