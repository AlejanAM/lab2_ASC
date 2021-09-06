import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from '../../../../../shared/shared.service';
import { BreadcrumbService } from '../../../../../shared/breadcrumb.service';
import { SubSystemsConstants } from './page-subsystems.constants';

@Component({
  selector: 'app-page-subsystems',
  templateUrl: './page-subsystems.component.html',
  styleUrls: ['./page-subsystems.component.scss']
})
class PageSubSystemsComponent implements OnInit {

  public productsServices : string;
  public igeda : string;
  public ong : string
  public sitramo : string;
  public indicators : string;
  public enadis : string;
  public enaho : string;
  public certifications : string;

  public productsServicesIndex: number;
  public igedaIndex: number;
  public ongIndex: number;
  public sitramoIndex: number;
  public indicatorsIndex: number;
  public enadisIndex: number;
  public enahoIndex: number;
  public certificationsIndex: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.productsServices = SubSystemsConstants.productsServices;
    this.productsServicesIndex = SubSystemsConstants.productsServicesIndex;
    this.igeda = SubSystemsConstants.igeda;
    this.igedaIndex = SubSystemsConstants.igedaIndex;
    this.ong = SubSystemsConstants.ong;
    this.ongIndex = SubSystemsConstants.ongIndex;
    this.indicators = SubSystemsConstants.indicators;
    this.indicatorsIndex = SubSystemsConstants.indicatorsIndex;
    this.sitramo = SubSystemsConstants.sitramo;
    this.sitramoIndex = SubSystemsConstants.sitramoIndex;
    this.enadis = SubSystemsConstants.enadis;
    this.enadisIndex = SubSystemsConstants.enadisIndex;
    this.enaho = SubSystemsConstants.enaho;
    this.enahoIndex = SubSystemsConstants.enahoIndex;
    this.certifications = SubSystemsConstants.certifications;
    this.certificationsIndex = SubSystemsConstants.certificationsIndex;
    this.addBreadcrumb();
  }

  ngOnInit() {
  }

    
  /**
   * Add the routes for the breadcrumb array based on the type of view
   */
  addBreadcrumb() {
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/catalog/principal-page-super-user'
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Usuarios',
      href: '/#/catalog/principal-page-super-user/view-list-users/page-subsystems'
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Subsistemas',
      href: `/#${this.activatedRoute.snapshot['_routerState'].url}`
    });
  }

  goToListUsers(module: number){
    this.sharedService.setListingUsersSuperUser(module);
    this.router.navigate(['page-list-user'],{relativeTo : this.activatedRoute.parent});
  }

}
export { PageSubSystemsComponent }
