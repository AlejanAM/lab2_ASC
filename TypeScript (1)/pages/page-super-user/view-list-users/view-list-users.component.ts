import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from '../../../../shared/shared.service';
import { BreadcrumbService } from '../../../../shared/breadcrumb.service';

@Component({
  selector: 'app-page-view-list-users',
  templateUrl: './view-list-users.component.html',
  styleUrls: ['./view-list-users.component.scss']
})
class PageViewListUserComponent implements OnInit {
  public itemBreadCrumb: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.itemBreadCrumb = [];
  }

  ngOnInit() {
    this.breadcrumbService.breadCrumbArray.subscribe(response => {
      this.itemBreadCrumb = response;
    });
  }

  goToSubSystems(){
    this.router.navigate(['view-list-users/page-subsystems'],{relativeTo : this.activatedRoute.parent});
  }

  goToListUsers(){
    this.sharedService.setListingUsersSuperUser(10);
    this.router.navigate(['view-list-users/page-list-user'],{relativeTo : this.activatedRoute.parent});
  }

}
export { PageViewListUserComponent }
