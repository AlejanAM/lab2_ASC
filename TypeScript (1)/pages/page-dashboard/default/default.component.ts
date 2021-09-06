import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../../../shared/breadcrumb.service'

@Component({
  selector: 'app-default-administrator',
  templateUrl: './default.component.html',
  styleUrls: [
    './default.component.scss',
    '../../../common/styles/style.scss'
  ],
})
class DefaultAdministratorComponent {

  @Input() userId: number;

  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) { 
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/catalog/page-dashboard'
    });
  }

}
export { DefaultAdministratorComponent }
