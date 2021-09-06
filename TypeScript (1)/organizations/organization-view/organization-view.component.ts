import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

import {OrganizationService} from '../organization.service';
import {CoreConstants} from '../../../core/core.constants';

@Component({
  selector: 'app-organization-view',
  templateUrl: './organization-view.component.html',
  styleUrls: ['./organization-view.component.scss', '../../common/styles/style.scss'],
  providers: [OrganizationService]
})
class OrganizationViewComponent implements OnInit {
  public organizationId: number;
  public userId: number;
  public roleId: number;
  public organization: any;
  public isConsultantUser: boolean;
  public isConsultantMode: boolean;
  public pageConsultantPath: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public organizationService: OrganizationService
  ) {
    this.roleId = CoreConstants.rolConsultant;
    this.userId = 0;
    this.isConsultantUser = false;
    this.isConsultantMode = false;
    this.pageConsultantPath = 'page-consultant-ong';
  }

  ngOnInit() {
    this.userId = +localStorage.getItem('userId');
    this.roleId = +localStorage.getItem('rolId');
    this.isConsultantUser =
      this.roleId === CoreConstants.rolConsultant || this.roleId === 0 ? true : false;
    this.activatedRoute.params.subscribe((params) => {
      this.organizationId = +params.organizationIdPk;
    });
    this.organizationService
      .getOrganizationDetail(this.organizationId)
      .then(this.handleGetOrganizationDetail.bind(this));
  }

  /**
   * Handles the organization details and sets them to organization
   * @param response
   */
  handleGetOrganizationDetail(response: any) {
    this.organization = response.organization.details;
    if (
      this.activatedRoute.parent.parent.parent.parent.snapshot.url.toString() ===
      this.pageConsultantPath
    ) {
      this.increaseViewOrg(this.organization.idPk, this.organization.orgViews);
    }
  }

  /**
   * Increase by 1 the views of the organization
   * @param views
   */
  increaseViewOrg(organizationId, views) {
    views = views + 1;
    this.organizationService.putOrganizationViews(organizationId, views).then();
  }

  backToList() {
    if (this.isConsultantUser) {
      this.router.navigate(['/catalog/page-consultant-ong/']);
    } else {
      this.router.navigate(['/catalog/page-dashboard']);
    }
  }

  updateOrganization() {
    this.router.navigate(
      [
        '/catalog/page-dashboard/organizations/acepted-organizations/organization-update',
        this.userId,
        this.organizationId
      ],
      {
        relativeTo: this.activatedRoute.parent
      }
    );
  }
}
export {OrganizationViewComponent};
