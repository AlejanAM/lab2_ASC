
import { throwError as observableThrowError, Observable } from 'rxjs';
import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { UserService } from '../../user/user.service';
import { UserConstants } from '../../user/user.constants';
import { SharedService } from '../../../shared/shared.service';
import { ModalNotificationService } from '../../../utils/modal/notifications/modal-notifications.service';
import { CoreConstants } from '../../../core/core.constants';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: [
    './profile-update.component.scss',
    '../../common/styles/style.scss'
  ],
  providers: [
    UserService,
    UserConstants
  ]
})
class ProfileUpdateComponent implements OnInit, AfterViewInit {
  public isNavBarVisible: boolean;
  public profileForm: FormGroup;
  public dniMask: any;
  public user: any;
  public roleId: number;
  private userId: number;
  public titleProfie: string;
  public idAdministratorRol = CoreConstants.rolSuperUser;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private notificationService: ModalNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {
    this.roleId = 0;
    this.userId = 0;
    this.user = {};
    this.titleProfie = 'Perfil';
    this.isNavBarVisible = false;
  }

  ngOnInit() {
    this.formConfiguration();
    this.dniMask = {
      mask: this.profileForm.controls.provenance.value ?
        UserConstants.dniNationalMask : UserConstants.dniForeignMask
    };
    this.userId = +this.route.snapshot.params.userId;
    this.roleId = +this.route.snapshot.params.roleId;
    this.userService.getUserDetail(this.userId)
      .then(this.handleUserDetail.bind(this))
      .catch((err) => observableThrowError(true));
    if (this.roleId === +CoreConstants.rolSuperUser) {
      this.titleProfie = 'Perfil';
      if (this.router.url.includes('principal-page-super-user')) {
        this.isNavBarVisible = false;
      } else {
        this.isNavBarVisible = true;
      }
    }
  }

  ngAfterViewInit() {
    this.ref.detectChanges();
  }

  formConfiguration() {
    this.profileForm = this.formBuilder.group({
      idPk: [''],
      provenance: [true],
      dni: ['', [
        Validators.required,
      ]],
      firstName: ['', [
        Validators.required,
      ]],
      lastName: ['', [
        Validators.required,
      ]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/[0-9]/)
      ]],
      email: ['', [
        Validators.required,
      ]],
      address: ['', [
        Validators.required,
      ]],
      sex: [true],
      profession: ['', [
        Validators.required,
      ]]
    });
  }

  handleUserDetail(response: any) {
    this.user = response.user.details;
    this.profileForm.controls.dni.setValue(this.user.identification);
    this.profileForm.controls.firstName.setValue(this.user.firstName);
    this.profileForm.controls.lastName.setValue(this.user.lastName);
    this.profileForm.controls.telephone.setValue(this.user.telephone);
    this.profileForm.controls.email.setValue(this.user.email);
    this.profileForm.controls.address.setValue(this.user.address);
    this.profileForm.controls.sex.setValue(this.user.sex);
    this.profileForm.controls.profession.setValue(this.user.profession);
  }

  handleProvenanceChange() {
    let provenance = this.profileForm.controls.provenance.value;

    this.dniMask = {
      mask: provenance ? UserConstants.dniNationalMask : UserConstants.dniForeignMask
    };
  }

  updateProfile(user: any, isValid: boolean) {
    if (this.user.idPk && isValid) {
      if (this.roleId === 1) {
        this.user.isApproved = false;
        this.user.isChecked = true;
      } else if (this.roleId == CoreConstants.rolSuperUser) {
        this.user.isApproved = true;
        this.user.isChecked = true;
      }
      this.userService.putUser(this.buildUserAsParameter(this.profileForm))
        .then(this.handleUpdateUser.bind(this))
        .catch(this.rejectUpdateUser.bind(this));
    }
  }

  buildUserAsParameter(profileForm: FormGroup) {
    let user = {
      idPk: this.user.idPk,
      identification: profileForm.controls.dni.value,
      firstName: profileForm.controls.firstName.value,
      lastName: profileForm.controls.lastName.value,
      telephone: profileForm.controls.telephone.value,
      address: profileForm.controls.address.value,
      email: profileForm.controls.email.value,
      sex: profileForm.controls.sex.value,
      profession: profileForm.controls.profession.value,
      username: this.user.username,
      emailVerified: this.user.emailVerified,
      verificationToken: this.user.verificationToken,
      isApproved: this.user.isApproved,
      isChecked: this.user.isChecked,
      isDeleted: this.user.isDeleted
    };

    return user;
  }

  handleUpdateUser(response: any) {
    if (this.roleId === CoreConstants.rolSuperUser) {
      this.notificationService.alertThis('Se ha actualizado la información correctamente', 'success', () => {
        this.router.navigate(['/catalog/principal-page-super-user/view-list-users']);
      });
    } else {
      this.notificationService.alertThis('Se ha actualizado la información correctamente', 'success', () => {
        this.router.navigate(['/catalog/profile', response.user.idPk]);
      });
    }
  }

  rejectUpdateUser(err: any) {
    if (err.status === 422 && !err.ok) {
      this.notificationService.alertThis('Este correo ya se ha registrado anteriormente.', 'error', () => { });
    } else {
      this.notificationService.alertThis('No se ha podido actualizar la información.', 'error', () => { });
    }
  }

}
export { ProfileUpdateComponent }
