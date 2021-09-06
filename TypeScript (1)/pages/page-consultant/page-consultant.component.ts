import { throwError as observableThrowError } from 'rxjs';
import {
  Component,
  OnInit,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ItemsService } from '../../items/items.service';
import { CoreConstants } from '../../../core/core.constants';
import { SharedService } from '../../../shared/shared.service';
import { TitleService } from '../../../shared/title.service';
import { BreadcrumbService } from '../../../shared/breadcrumb.service'

@Component({
  selector: 'app-principal-page-consultant',
  templateUrl: './page-consultant.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './page-consultant.component.scss',
    '../../common/styles/style.scss',
  ],
  providers: [
    ItemsService,
    CoreConstants
  ]
})
class PrincipalPageConsultantComponent implements OnInit {
  public itemsFound: any;
  public isProduct: boolean;
  public showItems: boolean;
  public showSpinner: boolean;
  public itemBreadCrumb : any;
  public productTypeSearchBreadCrumb : string;
  public isNotResult: boolean;
  
  /**
   * Constructor
   * @param router 
   * @param route 
   * @param itemsService 
   * @param sharedService 
   * @param ref 
   * @param titleService 
   * @param breadcrumbService 
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private sharedService: SharedService,
    private ref: ElementRef,
    private titleService: TitleService,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.isNotResult = false;
    this.showItems = false;
    this.isProduct = localStorage.getItem('isProduct') === 'false' ? false : true; // tslint:disable-line
    this.itemBreadCrumb = [];
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/home/welcome'
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Productos y Servicios',
      href: '/#/home/item'
    });
  }

  ngOnInit() {
    this.titleService.setTitle("Productos");
    this.ref.nativeElement.querySelector('ul').focus();
    this.breadcrumbService.breadCrumbArray.subscribe(response => {
      this.itemBreadCrumb = response;
    })
  }

  /**
   * Handles the click event
   * @param event 
   */
  handleShowState(event: any) {
    this.showItems = event.show;
    this.productTypeSearchBreadCrumb = event.name;
    this.getSearchedByWord(event.name);
  }

  /**
   * Function used for search by word
   * @param name 
   */
  getSearchedByWord(name: string) {
    this.itemsService.getSearchWord(name, this.isProduct)
      .then(this.handleItemsSearched.bind(this))
      .catch((err) => observableThrowError(true));
  }

  /**
   * Checks if the search got any results
   * @param response 
   */
  handleItemsSearched(response: any) {
    if (response.length === 0) {
      this.isNotResult = true;
    } else {
      this.isNotResult = false;
    }
    this.itemsFound = response;
  }
}
export { PrincipalPageConsultantComponent }
