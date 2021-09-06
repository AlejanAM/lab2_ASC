import {Component} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {ConfirmationUpdateService} from './confirmation-update.service';
import {UserService} from '../../../../user/user.service';

@Component({
  selector: 'app-confirmation-update',
  templateUrl: './confirmation-update.component.html',
  styleUrls: ['./confirmation-update.component.scss'],
})
export class ConfirmationUpdateComponent {
  title: string;
  public btnOkText?: string;
  message: any;
  type: string;
  public userData: any;
  public action: string;
  public btnText: string;

  constructor(
    private userService: UserService,
    private alertService: ConfirmationUpdateService,
    private sanitizer: DomSanitizer,
  ) {
    this.title = 'Cuadro de Confirmación';
    this.btnOkText = 'Continuar';
    this.alertService.getMessage().subscribe((message) => {
      this.message = message;
      // tslint:disable-next-line: triple-equals
      if (message != undefined) {
        this.userData = this.message.text.user.details;
        this.action = this.userData.isActive ? 'Desactivar' : 'Activar';
        this.btnText = this.userData.isActive ? 'Eliminar' : 'Activar';
      }
    });
  }

  /**
   * Changes the user data
   */
  changeUserStatus() {
    const body = this.setUser(this.userData);
    this.userService.putUserData(body).then(this.message.siFn()).catch();
  }

  /**
   * Set a variable with all the properties of an user and returns it
   * @param user
   */
  setUser(user) {
    const format = {
      idPk: user.idPk,
      identification: user.identification,
      firstName: user.firstName,
      lastName: user.lastName,
      telephone: user.telephone,
      email: user.email,
      address: user.address,
      province: user.province,
      canton: user.canton,
      distrit: user.distrit,
      nationality: user.nationality,
      sex: user.sex,
      profession: user.profession,
      birthDate: user.birthDate,
      realm: user.realm,
      username: user.username,
      emailVerified: user.emailVerified,
      isDeleted: user.isDeleted,
      isActive: this.userData.isActive ? false : true,
    };
    return format;
  }

  /**
   * Sanitize the message
   * @param code
   */
  sanitizerCode(code: string) {
    this.message = this.sanitizer.bypassSecurityTrustHtml(code);
    return this.message;
  }
}
