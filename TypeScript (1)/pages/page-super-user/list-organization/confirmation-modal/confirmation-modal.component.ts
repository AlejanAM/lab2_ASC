import { Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";

import { ConfirmationModalService } from './confirmation-modal.service'
import { UserService } from '../../../../user/user.service';
import { PageSuperUserService } from '../../page-super-user.service'

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  providers: [ PageSuperUserService ]
})
export class ConfirmationModalComponent {
  public title: string;
  public btnOkText?: string;
  public message: any;
  public type: string;
  public userData: any;
  public action: string;
  public btnText: string;
  public editorForm: FormGroup;

  constructor(
    private userService: UserService,
    private alertService: ConfirmationModalService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private superUserService: PageSuperUserService,
  ) { 
    this.title = 'Cuadro de Confirmación';
    this.btnOkText = 'Continuar';
    this.alertService.getMessage().subscribe(message => {
      this.message = message;
      if(message != undefined) { 
        this.userData = this.message.text;
      }
    });
  }

  /**
   * Deletes all the usersByOrganization that have been change to true
   */
  delete() {
    this.superUserService
      .deleteUserByOrganization(this.userData)
      .then(response => {
        this.message.siFn();
      })
      .catch()
  }

  /**
   * Sanitize the message 
   * @param code 
   */
  sanitizerCode(code: string){
    this.message = this.sanitizer.bypassSecurityTrustHtml(code);
    return this.message;
  }
}
