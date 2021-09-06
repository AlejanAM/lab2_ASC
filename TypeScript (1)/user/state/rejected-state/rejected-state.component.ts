
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
  selector: 'app-user-state-rejected',
  templateUrl: './rejected-state.component.html',
  styleUrls: ['../../../common/styles/style.scss'],
  providers: [UserService]
})

class UsersStateRejectedComponent implements OnInit {

  public usersNoApproved: any;
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
    this.usersNoApproved = [];
    this.isNotResult = false;
  }

  ngOnInit() {
    this.rolId = +localStorage.getItem('rolId');
    this.userId = +localStorage.getItem('userId');
    this.addBreadCrumb();
    let rolToConsultant = (this.rolId == CoreConstants.roleONGAdministrator) ? CoreConstants.roleONGEditor : (this.rolId == CoreConstants.rolAdministrator) ? CoreConstants.rolEditor : CoreConstants.rolEditor;
    this._userService.getUsers(rolToConsultant,false,false)
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
      page: 'Roles Rechazados',
      href: '/#/catalog/page-dashboard/users/rejected-users'
    });
  }

  handleShowUser(response: any) {
    if (response.length == 0) {
      this.isNotResult = true;
    } else {
      this.isNotResult = false;
    }
    this.usersNoApproved = response;
  }

  catchShowUsersError(err: any) {
    console.log(err);
  }

  showUser(user: any) {
    this._route.navigate(["user-inspect", this.userId, user],{relativeTo : this.activatedRoute.parent});
  }

  getUserToSearch(event: any) {
    this.userToSearch = event;
  }

}
export { UsersStateRejectedComponent }
