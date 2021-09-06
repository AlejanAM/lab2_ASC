import { Component, Input } from '@angular/core';

import { OrganizationService } from '../organization.service';

@Component({
  selector: 'app-organization-modal',
  templateUrl: './organization-modal.component.html',
  styleUrls: ['../../common/styles/style.scss'],
  providers: [OrganizationService]
})
class OrganizationModalComponent {

  @Input() isDeletingApproved: boolean;
  @Input() organizationsApproved: any;
  @Input() organizationsToDeleteApproved: any;
  @Input() organizationsToDeleteNoApproved: any;
  @Input() organizationsNoApproved: any;

  constructor(private organizationService: OrganizationService) {}

  deleteOrganizations() {
    if (this.isDeletingApproved) {
      for (let organization = 0;organization < this.organizationsToDeleteApproved.length; organization++) {
        this.organizationsApproved = this.organizationsApproved.filter(x => x.idPk !== this.organizationsToDeleteApproved[organization]);
      }
      this.organizationService.deleteManyOrganizations(this.organizationsToDeleteApproved);
    } else {
      this.organizationService.deleteManyOrganizations(this.organizationsToDeleteNoApproved);
      for(let organization = 0;organization < this.organizationsToDeleteNoApproved.length; organization++) {
        this.organizationsNoApproved = this.organizationsNoApproved.filter(x => x.idPk !== this.organizationsToDeleteNoApproved[organization]);
      }
    }
  }
}
export { OrganizationModalComponent }
