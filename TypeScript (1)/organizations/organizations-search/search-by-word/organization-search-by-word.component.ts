import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from '../../../../shared/shared.service';

@Component({
  selector: 'app-organization-searched-word',
  templateUrl: './organization-search-by-word.component.html',
  styleUrls: [
    './organizations-search-by-word.component.scss',
    '../../../common/styles/style.scss'
  ],
})
class OrganizationSearchWordComponent {

  public name: string;

  constructor(
    private sharedService: SharedService,
    private _route: ActivatedRoute,
    private router: Router
  ) { }

  searchProductByName() {
    this.sharedService.setWordOrganizationToSearch(this.name);
    this.router.navigate(['organization-result'],{relativeTo : this._route.parent});
  }

}
export { OrganizationSearchWordComponent }
