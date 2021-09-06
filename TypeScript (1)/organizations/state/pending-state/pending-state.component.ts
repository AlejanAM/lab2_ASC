import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { OrganizationService } from '../../organization.service';
import { CoreConstants } from '../../../../core/core.constants';
import { BreadcrumbService } from '../../../../shared/breadcrumb.service'

@Component({
  selector: 'app-organization-state-pending',
  templateUrl: './pending-state.component.html',
  styleUrls: [
    '../../organization.component.scss',
    '../../../common/styles/style.scss'
  ],
  providers: [OrganizationService]
})

class OrganizationsStatePendingComponent implements OnInit {

  public organizationsPending: any;
  public userId: number;
  public rolId: number;
  public isAdministrator: boolean;
  public isNotResult: boolean;
  public page: any;
  public titleModalConfirmation: string;
  public bodyModalConfirmation: string;
  public idOrganizationToInspect: number;
  public isAcceptingOrganization: boolean;
  public organizationToSearch: string;
  private roleByEntity: number;

  constructor(
    private _organizationService: OrganizationService,
    public _route: Router,
    public activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.organizationsPending = [];
    this.isNotResult = false;
    this.roleByEntity = 0;
  }

  ngOnInit() {
    this.userId = +localStorage.getItem('userId');
    this.rolId = +localStorage.getItem('rolId');
    this.addBreadCrumb();
    this.validateRole(this.rolId);
    this.isAdministrator = (this.rolId === CoreConstants.rolAdministrator
      || this.rolId === CoreConstants.roleONGAdministrator) ? true : false;
    if (this.rolId === CoreConstants.rolAdministrator || this.rolId === CoreConstants.rolAdministratorONG){
      this._organizationService.getOrganizations(false, true, this.roleByEntity)
        .then(this.handleShowOrganizations.bind(this))
        .catch((err) => Promise.reject(err));
    } else if (this.rolId === CoreConstants.rolEditor || this.rolId === CoreConstants.rolEditorONG){
      this._organizationService.getOrganization(this.userId, false, true)
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
      page: 'Entidades Pendientes',
      href: '/#/catalog/page-dashboard/organizations/pending-organizations'
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
    this.organizationsPending = response;
  }

  navigate(organization: any) {
    this._route.navigate(['/organization-inspect', this.userId, organization]);
  }

  showOrganization(organization: number) {
    if (this.isAdministrator) {
      this._route.navigate(['organization-inspect', organization], {
        relativeTo: this.activatedRoute.parent
      });
    } else {
      this._route.navigate(['organization-view', organization],{
        relativeTo: this.activatedRoute.parent
      });
    }
  }

  acceptOrganization(organizationId: number) {
    this.idOrganizationToInspect = organizationId;
    this.isAcceptingOrganization = true;
    this.titleModalConfirmation = '¿Aceptar?';
    this.bodyModalConfirmation = '¿Desea aprobar la entidad?';
  }

  rejectOrganization(organizationId: number) {
    this.idOrganizationToInspect = organizationId;
    this.isAcceptingOrganization = false;
    this.titleModalConfirmation = '¿Rechazar?';
    this.bodyModalConfirmation = '¿Desea rechazar la entidad?';
  }

  executeInspection(event: any) {
    if(this.isAcceptingOrganization) {
      this._organizationService.postOrganizationInspection(this.idOrganizationToInspect);
    } else {
      this._organizationService.postOrganizationInspection(this.idOrganizationToInspect, null,'Entidad rechazada por el administrador.');
    }
    this.organizationsPending = this.organizationsPending.filter(x => x.idPk !== this.idOrganizationToInspect);
  }

  getOrganizationToSearch(event: any) {
    this.organizationToSearch = event;
  }
}
export { OrganizationsStatePendingComponent }
