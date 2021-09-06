import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { CoreConstants } from '../../../../core/core.constants';
import { OrganizationService } from '../../organization.service';
import { BreadcrumbService } from '../../../../shared/breadcrumb.service'

@Component({
  selector: 'app-organization-state-acepted',
  templateUrl: './acepted-state.component.html',
  styleUrls: [
    '../../organization.component.scss',
    '../../../common/styles/style.scss'
  ],
  providers: [OrganizationService]
})

class OrganizationsStateAceptedComponent implements OnInit {

  public organizationsApproved: any;
  public organizationsToDeleteApproved: any;
  public userId: number;
  public rolId: number;
  public isAdministrator: boolean;
  public isNotResult: boolean;
  public page: any;
  public organizationToSearch: string;
  private roleByEntity: number;

  constructor(
    private _organizationService: OrganizationService,
    public _route: Router,
    public activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.organizationsToDeleteApproved = [];
    this.organizationsApproved = [];
    this.roleByEntity = 0;
    this.isAdministrator = false;
    this.isNotResult = false;
  }

  ngOnInit() {
    this.userId = +localStorage.getItem('userId');
    this.rolId = +localStorage.getItem('rolId');
    this.addBreadCrumb();
    this.validateRole(this.rolId);
    if(this.rolId === CoreConstants.rolAdministrator || this.rolId === CoreConstants.rolAdministratorONG){
      this.isAdministrator = true;
      this._organizationService.getOrganizations(true,true, this.roleByEntity)
        .then(this.handleShowOrganizations.bind(this))
        .catch((err) => Promise.reject(err));
    } else if(this.rolId === CoreConstants.rolEditor || this.rolId === CoreConstants.rolEditorONG){
      this.isAdministrator = false;
      this._organizationService.getOrganization(this.userId,true,true)
        .then(this.handleShowOrganizations.bind(this))
        .catch((err) => Promise.reject(err));
    }
  }

  /**
   * Add the routes for the breadcrumb array
   */
  addBreadCrumb(){
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/catalog/page-dashboard'
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Entidades Aprobadas',
      href: '/#/catalog/page-dashboard/organizations/acepted-organizations'
    });
  }

  /**
   * Validates the role by id of the user and sets the roleByEntity based on the the type of user logged
   * @param idRole 
   */
  validateRole(idRole){
    switch (idRole) {
      case 1:
        this.roleByEntity = 1;
      break;
      case 2:
        this.roleByEntity = 1;
      break;
      case 5:
        this.roleByEntity = 2;
      break;
      case 6:
        this.roleByEntity = 2;
      break;
      default:
        break;
    }
  }

  handleShowOrganizations(response: any) {
    if (response.length == 0) {
      this.isNotResult = true;
    } else {
      this.isNotResult = false;
    }
    this.organizationsApproved = response;
  }

  showOrganization(organization: any) {
    if (this.isAdministrator) {
      this._route.navigate(['organization-inspect', organization],{relativeTo : this.activatedRoute.parent});
    } else {
      this._route.navigate(['organization-view', organization],{relativeTo : this.activatedRoute.parent});
    }
  }

  updateOrganization(organizationId: number) {
    this._route.navigate(['organization-update', this.userId, organizationId],{relativeTo : this.activatedRoute.parent});
  }

  addOrganizationToDelete(organizationId: number) {
    if (this.organizationsToDeleteApproved.find(organization => organization === organizationId) === undefined) {
      this.organizationsToDeleteApproved.push(organizationId);
    } else {
      this.organizationsToDeleteApproved = this.organizationsToDeleteApproved.filter(organization => organization !== organizationId);
    }
  }

  handleOrganizationsDeleted(organizationsDeleted: any) {
    organizationsDeleted.map((organization) => {
      this.organizationsApproved = this.organizationsApproved.filter(x => x.idPk !== organization);
    });
  }

  getOrganizationToSearch(event: any) {
    this.organizationToSearch = event;
  }
  
}
export { OrganizationsStateAceptedComponent }
