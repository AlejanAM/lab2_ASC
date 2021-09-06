import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PATH_IMAGES } from './default.constants';
import { CoreConstants } from '../../core/core.constants';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})

class DefaultComponent {

  @Input() userId: number;
  @Input() roleId: number
  @Input() title: string;
  @Input() message: string;
  @Input() indexImg: number;

  public pathImages: string[];
  public roleAdministrator: number;

  constructor(
    private router: Router,
    private _route: ActivatedRoute
  ) {
    this.pathImages = PATH_IMAGES;
    this.roleAdministrator = CoreConstants.rolAdministratorCatalog;
  }

  goToCreateOrganization() {
    this.router.navigate(['organization-create', this.userId], {
      relativeTo: this._route.parent
    });
  }
}
export { DefaultComponent }
