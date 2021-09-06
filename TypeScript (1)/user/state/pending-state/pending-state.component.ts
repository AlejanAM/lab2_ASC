
import { throwError as observableThrowError, Observable } from 'rxjs';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../user.service';
import { CoreConstants } from '../../../../core/core.constants';
import { BreadcrumbService } from '../../../../shared/breadcrumb.service'

@Component({
  selector: 'app-user-state-pending',
  templateUrl: './pending-state.component.html',
  styleUrls: ['../../../common/styles/style.scss'],
  providers: [UserService]
})

class UsersStatePendingComponent implements OnInit {

  public usersPending: any;
  public userId: number;
  public rolId: number;
  public isNotResult: boolean;
  public page: any;
  public titleModalConfirmation: string;
  public bodyModalConfirmation: string;
  public idUserToInspect: number;
  public isAcceptingUser: boolean;
  public userToSearch: string;

  constructor(
    private _userService: UserService,
    public _route: Router,
    public activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.usersPending = [];
    this.isNotResult = false;
  }

  ngOnInit() {
    this.rolId = +localStorage.getItem('rolId');
    this.userId = +localStorage.getItem('userId');
    this.addBreadCrumb();
    let rolToConsultant = (this.rolId == CoreConstants.roleONGAdministrator) ? CoreConstants.roleONGEditor : (this.rolId == CoreConstants.rolAdministrator) ? CoreConstants.rolEditor : CoreConstants.rolEditor;
    this._userService.getUsers(rolToConsultant, true, false)
      .then(this.handleShowUser.bind(this))
      .catch((err: any) => observableThrowError(true));
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
      page: 'Roles Pendientes',
      href: '/#/catalog/page-dashboard/users/pending-users'
    });
  }

  handleShowUser(response: any) {
    if (response.length == 0) {
      this.isNotResult = true;
    } else {
      this.isNotResult = false;
    }
    this.usersPending = response;
  }

  acceptUser(userId: number) {
    this.idUserToInspect = userId;
    this.isAcceptingUser = true;
    this.titleModalConfirmation = '¿Aceptar?';
    this.bodyModalConfirmation = '¿Desea aprobar el rol de usuario?';
  }

  rejectUser(userId: number) {
    this.idUserToInspect = userId;
    this.isAcceptingUser = false;
    this.titleModalConfirmation = '¿Rechazar?';
    this.bodyModalConfirmation = '¿Desea rechazar el rol de usuario?';
  }

  executeInspection(event: any) {
    const roleUser = +localStorage.getItem('rolId');
    let rolToChange;
    if (roleUser === CoreConstants.rolAdministratorCatalog) {
      rolToChange = CoreConstants.rolEditorCatalog;
    } else if (roleUser === CoreConstants.rolAdministratorONG) {
      rolToChange = CoreConstants.rolEditorONG;
    }
    if (this.isAcceptingUser) {
      this._userService.postUserInspection(this.idUserToInspect, rolToChange, this.userId);
    } else {
      this._userService.postUserInspection(this.idUserToInspect, rolToChange, null, 'Usuario rechazado por el administrador.');
    }
    this.usersPending = this.usersPending.filter(x => x.idPk !== this.idUserToInspect);
  }

  showUser(user: any) {
    this._route.navigate(["user-inspect", this.userId, user], { relativeTo: this.activatedRoute.parent });
  }

  getUserToSearch(event: any) {
    this.userToSearch = event;
  }

}
export { UsersStatePendingComponent }
