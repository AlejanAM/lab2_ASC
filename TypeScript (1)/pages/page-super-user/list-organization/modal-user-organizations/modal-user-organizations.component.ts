import { Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";

import { ModalUserOrganization } from './modal-user-organization.service'
import { UserService } from '../../../../user/user.service';
import { PageSuperUserService } from '../../page-super-user.service'
import { ConfirmationModalService } from '../confirmation-modal/confirmation-modal.service'

@Component({
  selector: 'app-modal-user-organizations',
  templateUrl: './modal-user-organizations.component.html',
  styleUrls: ['./modal-user-organizations.component.scss'],
  providers: [ PageSuperUserService ]
})
export class ModalUserOrganizationsComponent {
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
    private alertService: ModalUserOrganization,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private superUserService: PageSuperUserService,
    private confirmModal: ConfirmationModalService,
  ) { 
    this.title = 'Cuadro de Confirmación';
    this.btnOkText = 'Continuar';
    this.formConfiguration()
    this.alertService.getMessage().subscribe(message => {
      this.message = message;
      if(message != undefined){
        this.userData = this.message.text;
        this.processMessage();
      }
    });
  }

  /**
   * Creates the form configuration.
   */
  formConfiguration() {
    this.editorForm = this.formBuilder.group({
      organizations: new FormArray([]),
    });
  }

  /**
   * Getter of organizations which its declare on the form config
   */
  get organizations() {
    return this.editorForm.get("organizations") as FormArray;
  }

  /**
   * Push a new control to the formArray collaborators
   */
  addOrganizationsInput() {
    this.organizations.push(new FormControl(true));
  }

  /**
   * Opens the confirmation modal
   */
  openConfirmation(idOrg, idUser) {
    const data : any = {
      userId: idUser,
      organizationId: idOrg
    }
    this.confirmModal.alertThis(
      data,
      'success', 
      () => {  });
      this.message.siFn();
    }

  /**
   * Process the message 
   */
  processMessage() {
    this.clearFormArray(this.organizations)
    for (const org of this.userData.organizations) {
      this.addOrganizationsInput();
    }
  }

  /**
   * Fully empty a form array
   */
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  /**
   * Sanitize the message 
   * @param code 
   */
  sanitizerCode(code: string){
    this.message = this.sanitizer.bypassSecurityTrustHtml(code);
    return this.message;
  }
}
