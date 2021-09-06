import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TitleService } from '../../../shared/title.service';
import { BreadcrumbService } from '../../../shared/breadcrumb.service'

@Component({
  selector: 'app-page-search-organizations',
  templateUrl: './organizations-search.component.html',
  styleUrls: [
    './organizations-search.component.scss',
    '../../common/styles/style.scss'
  ]
})
class OrganizationSearchComponent implements OnInit {

  constructor(
    private titleService: TitleService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle("Organizaciones No Gubernamentales (ONG)");
    this.breadcrumbService.addBreadCrumb({
      page: 'ONG',
      href: `/#${this.route.snapshot['_routerState'].url}`
    });
  }

}
export { OrganizationSearchComponent }
