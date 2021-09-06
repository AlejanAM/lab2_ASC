import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../../shared/breadcrumb.service'

@Component({
  selector: 'app-product-views',
  templateUrl: './product-views.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [    
    '../page-consultant.component.scss',
    '../../../common/styles/style.scss',]
})
export class ProductViewsComponent implements OnInit {
  public showItems: boolean;

  /**
   * Constructor
   * @param router 
   * @param breadcrumbService 
   */
  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit() {
    this.breadcrumbService.addBreadCrumb({
      page: 'Productos',
      href: '/#/catalog/principal-page-consultant/products'
    });
  }

  /**
   * Handles the click event of the product search and also redirects the user
   * @param event 
   */
  handleShowState(event: any) {
    if (event.type === 0) {
      this.router.navigate(['catalog/principal-page-consultant/itemlist'], {
        queryParams: { type: 'group', value: event.group },
      });
    } else if (event.type === 1) {
      this.router.navigate(['catalog/principal-page-consultant/itemlist'], {
        queryParams: { type: 'search', value: event.name },
      });
    } else if (event.type === 2) {
      this.router.navigate(['catalog/principal-page-consultant/itemlist'], {
        queryParams: { type: 'category', value: event.category },
      });
    }
  }
}
