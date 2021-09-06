import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbService } from "../../../../shared/breadcrumb.service"

@Component({
  selector: 'app-services-views',
  templateUrl: './services-views.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [    
    '../page-consultant.component.scss',
    '../../../common/styles/style.scss',]
})
export class ServicesViewsComponent implements OnInit {
  public showItems: boolean;

  /**
   * Constructor
   * @param router 
   * @param breadcrumbService 
   */
  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) { 
    this.showItems = false;
  }

  ngOnInit() {
    this.breadcrumbService.addBreadCrumb({
      page: 'Servicios',
      href: '/#/catalog/principal-page-consultant/services'
    });
  }

  /**
   * Handles the click event of the service search and also redirects the user
   * @param event 
   */
  handleShowState(event: any) {
    if (event.type === 3) {
      this.router.navigate(['catalog/principal-page-consultant/itemlist'], {
        queryParams: { type: 'sector', value: event.sector },
      });
    } else if (event.type === 1) {
      this.router.navigate(['catalog/principal-page-consultant/itemlist'], {
        queryParams: { type: 'search', value: event.name },
      });
    } 
  }
}
