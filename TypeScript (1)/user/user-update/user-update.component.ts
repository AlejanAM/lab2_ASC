
import {throwError as observableThrowError,  Observable } from 'rxjs';
import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';

import { UserService } from '../user.service';
import { UserConstants } from '../user.constants';

@Component({
  selector: 'app-user',
  templateUrl: './user-update.component.html',
  providers: [
    UserService,
    UserConstants
  ]
})
class UserUpdateComponent implements OnInit {

  public userForm: FormGroup;
  public showMessage: boolean;
  public isSuccessful: boolean;
  public dniMask: any;
  public user: any;
  private userId: number;
  private crudId: number;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.formConfiguration();
    this.dniMask = {
      mask: this.userForm.controls.provenance.value ?
        UserConstants.dniNationalMask : UserConstants.dniForeignMask
    };
    this.route.params.subscribe(params => {
      this.userId = +params.userIdPk;
      this.crudId = +params.crudId;
    });
    this.userService.getUserDetail(this.userId)
      .then(this.handleUserDetail.bind(this))
      .catch((err) => {
        return observableThrowError(true);
      });
  }

  formConfiguration() {
    this.userForm = this.formBuilder.group({
      idPk: [''],
      provenance: [true],
      dni: ['', [
        Validators.required,
        Validators.maxLength(15)
      ]],
      firstName: ['', [
        Validators.required,
        Validators.maxLength(30)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(65)
      ]],
      telephone: ['', [
        Validators.required,
        Validators.maxLength(25),
        Validators.pattern(/[0-9]/)
      ]],
      email: ['', [
        Validators.required,
        Validators.maxLength(60)
      ]],
      address: ['', [
        Validators.required,
        Validators.maxLength(90)
      ]],
      sex: [true],
      profession: ['', [
        Validators.required,
        Validators.maxLength(40)
      ]],
      password: ['', [
        Validators.required,
        Validators.maxLength(200)
      ]],
      confirmPassword: ['']
    }, {
      validator: this.userService.checkIfMatchingPasswords('password', 'confirmPassword')
    });
  }

  handleUserDetail(response: any) {
    this.user = response.user.details;
    this.userForm.controls.dni.setValue(this.user.identification);
    this.userForm.controls.firstName.setValue(this.user.firstName);
    this.userForm.controls.lastName.setValue(this.user.lastName);
    this.userForm.controls.telephone.setValue(this.user.telephone);
    this.userForm.controls.email.setValue(this.user.email);
    this.userForm.controls.address.setValue(this.user.address);
    this.userForm.controls.sex.setValue(this.user.sex);
    this.userForm.controls.profession.setValue(this.user.profession);
  }

  updateUser(user: any, isValid: boolean) {
    if (this.user.idPk && isValid) {
      if (this.crudId === 1) {
        this.user.isApproved = false;
        this.user.isChecked = true;
      }
      this.userService.putUser(this.buildUserAsParameter(this.userForm))
      .then(this.handleUpdateUser.bind(this))
      .catch(this.catchUpdateUser.bind(this));
    }
  }

  buildUserAsParameter(userForm: FormGroup) {
    let user = {
      idPk: this.user.idPk,
      identification: userForm.controls.dni.value,
      firstName: userForm.controls.firstName.value,
      lastName: userForm.controls.lastName.value,
      telephone: userForm.controls.telephone.value,
      address: userForm.controls.address.value,
      email: userForm.controls.email.value,
      sex: userForm.controls.sex.value,
      profession: userForm.controls.profession.value,
      password: userForm.controls.password.value,
      username: this.user.username,
      emailVerified: this.user.emailVerified,
      verificationToken: this.user.verificationToken,
      isApproved: this.user.isApproved,
      isChecked: this.user.isChecked,
      isDeleted: this.user.isDeleted
    };

    return user;
  }

  handleUpdateUser(user: any) {
    this.showMessage = true;
    this.isSuccessful = true;
  }

  catchUpdateUser(err: any) {
    this.showMessage = true;
    this.isSuccessful = false;
  }

  logOut() {
    this.showMessage = false;
    this.router.navigate(['/']);
  }

  backToProfile() {
    this.router.navigate(['show-user', this.userId, this.crudId]);
  }

}
export { UserUpdateComponent }
