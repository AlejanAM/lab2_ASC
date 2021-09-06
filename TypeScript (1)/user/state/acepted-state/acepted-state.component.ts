
import {throwError as observableThrowError,  Observable } from 'rxjs';
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../user.service';
import { CoreConstants } from '../../../../core/core.constants';
import { BreadcrumbService } from '../../../../shared/breadcrumb.service'

@Component({
  selector: 'app-user-state-acepted',
  templateUrl: './acepted-state.component.html',
  styleUrls: ['../../../common/styles/style.scss'],
  providers: [UserService]
})

class UsersStateAceptedComponent implements OnInit {

  public usersApproved: any;
  public userId: number;
  public rolId: number;
  public isNotResult: boolean;
  public page: any;
  public userToSearch: string;

  constructor(
    private _userService: UserService,
    public _route: Router,
    public activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.usersApproved = [];
    this.isNotResult = false;
  }

  ngOnInit() {
    this.rolId = +localStorage.getItem('rolId');
    this.userId = +localStorage.getItem('userId');
    this.addBreadCrumb();
    let rolToConsultant = (this.rolId == CoreConstants.roleONGAdministrator) ? CoreConstants.roleONGEditor : (this.rolId == CoreConstants.rolAdministrator) ? CoreConstants.rolEditor : CoreConstants.rolEditor;
    this._userService.getUsers(rolToConsultant,true,true)
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
      page: 'Roles Aprobados',
      href: '/#/catalog/page-dashboard/users/acepted-users'
    });
  }

  handleShowUser(response: any) {
    if (response.length == 0) {
      this.isNotResult = true;
    } else {
      this.isNotResult = false;
    }
    this.usersApproved = response;
  }

  showUser(user: any) {
    this._route.navigate(["user-inspect", this.userId, user],{relativeTo : this.activatedRoute.parent});
  }

  getUserToSearch(event: any) {
    this.userToSearch = event;
  }

}
export { UsersStateAceptedComponent }
