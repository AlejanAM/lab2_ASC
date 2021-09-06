import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {PageSuperUserService} from '../../page-super-user.service';
import {SharedService} from '../../../../../shared/shared.service';
import {BreadcrumbService} from '../../../../../shared/breadcrumb.service';
import {ConfirmationUpdateService} from '../confirmation-modal/confirmation-update.service';
import {UserService} from '../../../../user/user.service';

@Component({
  selector: 'app-page-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
  providers: [PageSuperUserService, UserService],
})
class PageListUserComponent implements OnInit {
  public listUserWithRol: any;
  public userToSearch: string;
  public page: any;
  public rolId: number;
  public userData: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pageSuperUserService: PageSuperUserService,
    private sharedService: SharedService,
    private breadcrumbService: BreadcrumbService,
    private confirmationModalService: ConfirmationUpdateService,
    private userService: UserService,
  ) {
    this.listUserWithRol = [];
    this.rolId = +localStorage.getItem('rolId');
    this.addBreadcrumb();
  }

  ngOnInit() {
    if (this.sharedService.getListingUsersSuperUser() === 10) {
      this.pageSuperUserService
        .getAllUserWithRol()
        .then(this.handleListUserWithRol.bind(this));
    } else {
      this.pageSuperUserService
        .getAllUserByModule(this.sharedService.getListingUsersSuperUser())
        .then(this.handleUserByModule.bind(this));
    }
  }

  /**
   * Add the routes for the breadcrumb array based on the type of view
   */
  addBreadcrumb() {
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/catalog/principal-page-super-user',
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Usuarios',
      href:
        '/#/catalog/principal-page-super-user/view-list-users/page-subsystems',
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Ver Usuarios',
      href: `/#${this.activatedRoute.snapshot['_routerState'].url}`,
    });
  }

  handleUserByModule(response: any) {
    this.listUserWithRol = [];
    response.map((user) => {
      let userInfo = {
        name: user.firstName + ' ' + user.lastName,
        idPk: user.idPk,
        allUserRoles: user.name,
      };
      this.listUserWithRol.push(userInfo);
    });
  }

  handleListUserWithRol(response: any) {
    this.listUserWithRol = [];
    response.map((user) => {
      let userInfo = {
        name: user.firstName + ' ' + user.lastName,
        idPk: user.idPk,
        allUserRoles: '',
      };
      let allUserRoles = '';
      for (let rol of user.roles) {
        allUserRoles += rol + ', ';
      }
      userInfo.allUserRoles = allUserRoles;
      this.listUserWithRol.push(userInfo);
    });
  }

  updateUser(userId: number) {
    this.router.navigate(['../profile-info', userId], {
      relativeTo: this.activatedRoute,
    });
  }

  getUserToSearch(userToSearch: string) {
    this.userToSearch = userToSearch;
  }

  /**
   * Calls the confirmation modal
   */
  changeUserStatus(user: any) {
    this.getUserData(user);
  }

  /**
   * Sets the new status to the existing editable user
   * @param result
   */
  getUserData(user) {
    this.userService.getUserDetail(user.idPk).then((result) => {
      this.userData = result;
      this.confirmationModalService.alertThis(
        this.userData,
        'success',
        () => {},
      );
    });
  }
}
export {PageListUserComponent};
