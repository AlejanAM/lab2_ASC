
import {throwError as observableThrowError,  Observable } from 'rxjs';
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../user.service';
import { BreadcrumbService } from '../../../shared/breadcrumb.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  providers: [UserService]
})
class UserDetailComponent implements OnInit {

  public userDetail: any;
  public userId : number;
  public crudId: number;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    ) {
    this.userDetail = {};
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.userId = +params.userIdPk;

      if (params.crudId) {
        this.crudId = +params.crudId;
      }
    });
    this._userService.getUserDetail(this.userId)
      .then(this.handleOrganizationDetail.bind(this))
      .catch((err) => {
        return observableThrowError(true);
      });
  }

  addBreadCrumb(user) {
    this.breadcrumbService.addBreadCrumb({
      page: user,
      href: `/#${this._route.snapshot['_routerState'].url}`
    });
  }

  backToEditorView() {
    this.router.navigate(['page-dashboard']);
  }


  backToAdminView() {
    this.router.navigate(['page-dashboard']);
  }

  updateProfile() {
    this.router.navigate(['update-user', this.userId, this.crudId]);
  }

  handleOrganizationDetail(response: any) {
    this.userDetail.idPk = response.user.details.idPk;
    this.userDetail.identification = response.user.details.identification;
    this.userDetail.firstName = response.user.details.firstName;
    this.userDetail.lastName = response.user.details.lastName;
    this.userDetail.telephone = response.user.details.telephone;
    this.userDetail.email = response.user.details.email;
    this.userDetail.address = response.user.details.address;
    this.userDetail.sex = response.user.details.sex ? 'Masculino' : 'Femenino';
    this.userDetail.profession = response.user.details.profession;
    this.addBreadCrumb(this.userDetail.firstName);
  }

}
export { UserDetailComponent }
