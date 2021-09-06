import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Response} from '@angular/http';

import {UserService} from '../user/user.service';
import {SharedService} from '../../shared/shared.service';
import {OrganizationService} from '../organizations/organization.service';
import {ModalNotificationService} from '../../utils/modal/notifications/modal-notifications.service';
import {ProfileService} from './profile.service';
import {CoreConstants} from '../../core/core.constants';
import {BreadcrumbService} from '../../shared/breadcrumb.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    'profile.component.scss',
    './update/profile-update.component.scss',
    '../common/styles/style.scss',
  ],
  providers: [UserService, OrganizationService, ProfileService],
})
class ProfileComponent implements OnInit {
  public isNavBarVisible: boolean;
  public user: any;
  public toUpdate: boolean;
  public existOrganization: boolean;
  public profileInput: any;
  public unsubscribeRoles: any;
  public isRequested: boolean;
  public roleId: number;
  public userName: string;
  public titleProfie: string;
  //Super User Variables
  public userToEdit: number;
  public idRolSuperUser: number;
  public rolesToEditSuperUser: any;
  public rolesSelected: any;
  public status: string;

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private organizationService: OrganizationService,
    private notificationService: ModalNotificationService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.existOrganization = false;
    this.isRequested = false;
    this.profileInput = {};
    this.unsubscribeRoles = [];
    this.user = {};
    this.idRolSuperUser = CoreConstants.rolSuperUser;
    this.rolesToEditSuperUser = [];
    this.rolesSelected = [];
    this.titleProfie = 'Mi Perfil';
  }

  ngOnInit() {
    this.roleId = localStorage.getItem('rolId')
      ? +localStorage.getItem('rolId')
      : 0;
    if (this.roleId !== this.idRolSuperUser) {
      this.sharedService.setSuperUserProfileBehavior = true;
      const userId = +localStorage.getItem('userId');
      this.userService
        .getUserDetail(userId)
        .then(this.handleGetUser.bind(this))
        .then(this.handleGetUserRoles.bind(this))
        .then(this.handleGetUserOrganizations.bind(this));
    } else {
      this.titleProfie = 'Perfil';
      if (this.router.url.includes('principal-page-super-user')) {
        this.sharedService.setSuperUserProfileBehavior = false;
      } else {
        this.sharedService.setSuperUserProfileBehavior = true;
      }
      this.route.params.subscribe((params) => {
        this.userToEdit = params.userToEditIdPk
          ? +params.userToEditIdPk
          : +params.userId;
      });
      this.loadUserDetail(this.userToEdit);
    }
    this.sharedService.getSuperUserProfileBehavior.subscribe(
      (value) => (this.isNavBarVisible = value),
    );
  }

  /**
   * Add the routes for the breadcrumb array based on the type of view
   */
  addBreadcrumb(username) {
    this.breadcrumbService.addBreadCrumb({
      page: username,
      href: `/#${this.route.snapshot['_routerState'].url}`,
    });
  }

  private loadUserDetail(userId: number) {
    this.userService
      .getUserDetail(userId)
      .then(this.handleGetUser.bind(this))
      .then(this.handleGetUserRoles.bind(this))
      .then(this.handleGetUserOrganizations.bind(this))
      .then(this.handleRolesToEditSuperUser.bind(this));
  }

  setRoleModules(userId: number, roles: any) {
    this.isRequested = false;
    this.unsubscribeRoles = [];
    const administratorModule = roles.find(
      (r) => r.isAdministratorModule === 1,
    );
    const editorModule = roles.find((r) => r.isEditorModule === 1);
    if (administratorModule && !editorModule) {
      this.profileService
        .getUnSubscribeRoles(userId, false, true)
        .then(this.handleUnSubscribeRoles.bind(this));
    } else if (!administratorModule && editorModule) {
      this.profileService
        .getUnSubscribeRoles(userId, true, false)
        .then(this.handleUnSubscribeRoles.bind(this));
    }
  }

  editProfile() {
    const roleId = localStorage.getItem('rolId')
      ? localStorage.getItem('rolId')
      : 0;
    if (this.roleId !== this.idRolSuperUser) {
      this.router.navigate(['profile-update', this.user.idPk, roleId], {
        relativeTo: this.route.parent,
      });
    } else {
      if (this.router.url.includes('principal-page-super-user')) {
        this.router.navigate(
          ['../../user-update', this.userToEdit, localStorage.getItem('rolId')],
          {relativeTo: this.route},
        );
      } else {
        this.router.navigate(['profile-update', this.user.idPk, roleId], {
          relativeTo: this.route.parent,
        });
      }
    }
  }

  handleGetUser(param: any) {
    this.user = param.user.details;
    this.addBreadcrumb(this.user.firstName);
    this.status = this.user.isActive ? 'Desactivar' : 'Activar';
    return this.profileService.getRoleById(this.user.idPk);
  }

  handleGetUserRoles(roles: any) {
    this.user.roles = roles;
    this.setRoleModules(this.user.idPk, this.user.roles);
    return this.organizationService.getOrganizationsUser(this.user.idPk);
  }

  handleGetUserOrganizations(organizations: any) {
    if (organizations.length !== 0) {
      this.user.organizations = organizations;
      this.existOrganization = true;
    }
    this.userName =
      this.user.firstName.charAt(0) + this.user.lastName.charAt(0);
    if (this.roleId === this.idRolSuperUser) {
      return this.profileService.getRolesToEditBySuperUser(this.userToEdit);
    }
  }

  handleRolesToEditSuperUser(response: any) {
    response.userRoles.map((role) => {
      let userRolesByUser = response.userRolesByUser;
      let isRoleApproved = userRolesByUser.find(
        (userRole) => userRole.roleIdPK === role.idPK,
      );
      let roleItem = {
        name: role.name,
        idPk: role.idPK,
        isApproved: isRoleApproved !== undefined ? true : false,
      };
      if (role.idPK !== CoreConstants.rolConsultant) {
        if (isRoleApproved) this.rolesSelected.push(role.idPK);
        this.rolesToEditSuperUser.push(roleItem);
      }
    });
  }

  addRoleToUpdate(idRole) {
    let isAdded = this.rolesSelected.find((role) => role === idRole);
    if (isAdded) {
      this.rolesSelected = this.rolesSelected.filter((role) => role !== idRole);
    } else {
      this.rolesSelected.push(idRole);
    }
    if (this.rolesSelected.length === 0) {
      this.rolesSelected.push(CoreConstants.rolConsultant);
    }
    this.profileService.postSubscribeRol(this.userToEdit, this.rolesSelected);
  }

  handleUnSubscribeRoles(roles: any) {
    roles.map((role) => {
      role.isChecked = false;
      this.unsubscribeRoles.push(role);
    });
  }

  roleSubscribe(index: number) {
    this.unsubscribeRoles[index].isChecked = !this.unsubscribeRoles[index]
      .isChecked;
    this.checkRoleSubscribe();
  }

  checkRoleSubscribe() {
    let check = 0;
    this.unsubscribeRoles.map((role) => {
      if (role.isChecked) {
        check++;
      }
    });
    this.isRequested = this.isSubscribe(check);
  }

  isSubscribe(check: number) {
    return check > 0;
  }

  addRolesToSubscribe() {
    const userId = +localStorage.getItem('userId');
    this.profileService
      .createUserRole(this.unsubscribeRoles, userId)
      .then((response: Response) => {
        this.notificationService.alertThis(
          'Rol solicitado, esperando confirmación!',
          'success',
          () => {},
        );
        this.loadUserDetail(userId);
      })
      .catch(() =>
        this.notificationService.alertThis(
          'Error al solicitar rol',
          'error',
          () => {},
        ),
      );
  }

  goToResetPassword() {
    this.userService
      .verifyEmail(this.user.email)
      .then(this.handleVerificationEmail.bind(this))
      .catch(this.rejectVerificationEmail.bind(this));
  }

  handleVerificationEmail() {
    this.showInfo();
  }

  rejectVerificationEmail(err: Error) {
    this.showError();
  }

  showInfo() {
    this.notificationService.alertThis(
      `Se ha enviado un correo a <b> ${this.user.email} </b> para continuar con el cambio de contraseña.`,
      'success',
      () => {},
    );
  }

  showError() {
    this.notificationService.alertThis(
      'No se ha podido validar el correo electrónico del usuario.',
      'error',
      () => {},
    );
  }
}
export {ProfileComponent};
