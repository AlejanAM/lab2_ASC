import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationService } from '../organization.service';
import { OrganizationsDetailComponent } from '../organization-detail/organization-detail.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-inspect',
  templateUrl: './organization-inspect.component.html',
  styleUrls: [
    './organization-inspect.component.scss',
    '../../common/styles/style.scss'
  ],
  providers: [OrganizationService]
})

class OrganizationsInspectComponent implements OnInit {

  public descriptionReject: string;
  public idOrganization: number;
  public userId: number;
  public titleModalConfirmation: string;
  public bodyModalConfirmation: string;
  public isAcceptingUser: boolean;

  constructor(
    private _organizationService: OrganizationService,
    private router: Router,
    private _route: ActivatedRoute
  ) {
    this.descriptionReject = '';
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.idOrganization = +params.organizationIdPk;
    });
    this._route.params.subscribe(params => {
      this.userId = +params.userIdPk;
    });
  }

  acceptOrganization() {
    this.isAcceptingUser = true;
    this.titleModalConfirmation = '¿Aceptar?';
    this.bodyModalConfirmation = '¿Desea aprobar la entidad?';
  }

  rejectOrganization() {
    this.isAcceptingUser = false;
    this.titleModalConfirmation = '¿Rechazar?';
    this.bodyModalConfirmation = '¿Desea rechazar la entidad?';
    if (this.descriptionReject == '') {
      this.descriptionReject = 'Usuario rechazado por el administrador';
    }
  }

  executeInspection(event: any) {
    if(this.isAcceptingUser) {
      this._organizationService.postOrganizationInspection(this.idOrganization, this.userId);
    } else {
      this._organizationService.postOrganizationInspection(this.idOrganization, this.userId, this.descriptionReject);
    }
    this.router.navigate(['catalog/page-dashboard/organizations/pending-organizations']);
  }

  deleteOrganization() {

  }

}
export { OrganizationsInspectComponent }
