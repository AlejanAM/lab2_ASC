import { 
    Component, 
    OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { PageSuperUserService } from '../page-super-user.service';
import { ModalNotificationService } from '../../../../utils/modal/notifications/modal-notifications.service';

@Component({
  selector: 'app-legal-representative-organization',
  templateUrl: './legal-representative-organization.component.html',
  styleUrls: ['./legal-representative-organization.component.scss'],
  providers: [
    PageSuperUserService
  ]
})
class LegalRepresentativeOrganizationComponent implements OnInit {

  public legalRepresentativeForm: FormGroup;
  public usersList: any;
  public organizarionsList: any;

  constructor(
    private formBuilder: FormBuilder,
    private pageSuperUserService: PageSuperUserService,
    private notificationService: ModalNotificationService
  ) {
    this.usersList = [];
    this.organizarionsList = [];
  }

  ngOnInit() {
    this.formConfiguration();
    this.getAllData();
  }

  getAllData() {
    this.pageSuperUserService.getAllUsers()
    .then(this.handleUsers.bind(this));
    this.pageSuperUserService.getAllOrganizations()
    .then(this.handleOrganizations.bind(this));
  }

  handleUsers(response: any) {
    this.usersList = response;
  }

  handleOrganizations(response: any) {
    this.organizarionsList = response;
  }

  formConfiguration() {
    this.legalRepresentativeForm = this.formBuilder.group({
        userId: [0, [
            Validators.required
        ]],
        organizationId: [0, [
          Validators.required
        ]]
    });
  }

  saveLegalRepresentative() {
    let dataNewLegalRepresentative = this.legalRepresentativeForm.value;
    this.pageSuperUserService.postNewLegalRepresentative(dataNewLegalRepresentative.userId, dataNewLegalRepresentative.organizationId)
    .then(this.handleRegister.bind(this));
  }

  handleRegister(response: any) {
    if(response.isError){
      this.notificationService.alertThis(response.message , 'error' , () => {});      
    } else {
      this.notificationService.alertThis('La información ha sido registrada correctamente' , 'success' , () => {});
    }
    this.legalRepresentativeForm.reset();
  }

}
export { LegalRepresentativeOrganizationComponent }
