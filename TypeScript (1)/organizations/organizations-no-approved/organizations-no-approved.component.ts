
import {throwError as observableThrowError,  Observable } from 'rxjs';
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OrganizationComponent } from './organization/organization.component';
import { OrganizationService } from '../organization.service';

@Component({
  selector: 'app-organizations-no-approved',
  templateUrl: './organizations-no-approved.component.html',
  styleUrls: ['../../common/styles/style.scss'],
  providers: [OrganizationService]
})
class OrganizationsNoApprovedComponent implements OnInit {

  public organizationsNoApproved: any;
  public organizationsApproved: any;
  public organizationsPending: any;
  public isApprovedSelected: boolean;
  public isApprovedNoSelected: boolean;
  public isPendingSelected: boolean;
  public userId: number;
  private roleByEntity: number;
  public rolId: number;

  constructor(private _organizationService: OrganizationService, public _route: Router, public activatedRoute: ActivatedRoute) {
    this.organizationsNoApproved = [];
    this.organizationsApproved = [];
    this.organizationsPending = [];
    this.isApprovedSelected = true;
    this.isApprovedNoSelected = true;
    this.isPendingSelected = false;
    this.roleByEntity = 0;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = +params.userIdPk;
    });
    this.rolId = +localStorage.getItem('rolId');
    this.validateRole(this.rolId);
    this._organizationService.getOrganizations(true,true,this.roleByEntity)
    .then(this.handleShowOrganizations.bind(this))
    .catch((err) => observableThrowError(true));
  }

    /**
   * Validates the role by id of the user and sets the roleByEntity based on the the type of user logged
   * @param idRole 
   */
  validateRole(idRole){
    switch (idRole) {
      case 1:
        this.roleByEntity = 1;
      break;
      case 2:
        this.roleByEntity = 1;
      break;
      case 5:
        this.roleByEntity = 2;
      break;
      case 6:
        this.roleByEntity = 2;
      break;
      default:
        break;
    }
  }

  handleShowOrganizations(response: any) {
    let organizations = response;
    organizations.map((item) => {
      if (item.isApproved && item.isChecked) {
        this.organizationsApproved.push(item);
      } else if (!item.isApproved && !item.isChecked) {
        this.organizationsNoApproved.push(item);
      } else if (!item.isApproved && item.isChecked) {
        this.organizationsPending.push(item);
      }
    });
  }

  selectingCondition(condition: number) {
    if (condition === 1) {
      this.isApprovedSelected = true;
      this.isApprovedNoSelected = true;
      this.isPendingSelected = false;
    } else if (condition === 2) {
      this.isApprovedSelected = false;
      this.isApprovedNoSelected = true;
      this.isPendingSelected = true;
    } else if (condition === 3) {
      this.isApprovedSelected = true;
      this.isApprovedNoSelected = false;
      this.isPendingSelected = true;
    }
  }

  navigate(organization: any) {
    this._route.navigate(['/organization-inspect', this.userId, organization]);
  }

}
export { OrganizationsNoApprovedComponent }
