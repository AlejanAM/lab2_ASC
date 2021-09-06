
import { throwError as observableThrowError, Observable } from 'rxjs';
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ItemsService } from '../../../items/items.service';
import { CoreConstants } from '../../../../core/core.constants';
import { SharedService } from '../../../../shared/shared.service';
import { BreadcrumbService } from '../../../../shared/breadcrumb.service'

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../page-consultant.component.scss',
    '../../../common/styles/style.scss',
  ],
  providers: [
    ItemsService,
    CoreConstants
  ]
})
class ItemsListComponent implements OnInit {

  public itemsFound: any;
  public isProduct: boolean;
  public showItems: boolean;
  public showSpinner: boolean;
  public page: number;
  public itemBreadCrumb : string;
  public productTypeSearchBreadCrumb : string;
  public productCategorySearchBreadCrumb : string;
  public principalPageSICID : string;
  public principalPageSICIDCatalog : string;
  public principalPageSICIDCatalogAngular : string;
  public isNotResult: boolean;

  /**
   * Constructor
   * @param router 
   * @param route 
   * @param itemsService 
   * @param sharedService 
   * @param ref 
   * @param coreConstants 
   * @param breadcrumbService 
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private sharedService: SharedService,
    private ref: ElementRef,
    public coreConstants: CoreConstants,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.isNotResult = false;
    this.principalPageSICID = CoreConstants.PATH_URL_SICID;
    this.principalPageSICIDCatalog = CoreConstants.PATH_URL_SICID_Catalog;
    this.principalPageSICIDCatalogAngular = CoreConstants.PATH_URL_SICID_Catalog_Angular;
    this.showItems = false;
    this.showSpinner = false;
    this.isProduct = localStorage.getItem('isProduct') === 'false' ? false : true; // tslint:disable-line
    this.itemBreadCrumb = this.isProduct ? 'Productos' : 'Servicios';
    this.productTypeSearchBreadCrumb = null;
    this.productCategorySearchBreadCrumb = null;
    this.page = 1;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.handleSearchData(params.type, params.value)
    })
    setTimeout(() => {
      this.sharedService.setSpinnerLoading(false);
      this.showSpinner = true;
    }, 2000);
  }

  /**
   * search products by groud id
   * @param groupId 
   */
  getProductsbyGroup(groupId: number) {
    this.itemsService.getProductsGroups(groupId)
      .then(this.handleItemsSearched.bind(this))
      .catch((err) => observableThrowError(true));
  }

  /**
   * search products by category id
   * @param categoryId 
   */
  getProductsbyCategory(categoryId: number) {
    this.itemsService.getProductsCategories(categoryId)
      .then(this.handleItemsSearched.bind(this))
      .catch((err) => observableThrowError(true));
  }

  /**
   * search data by word
   * @param name 
   */
  getSearchedByWord(name: string) {
    this.itemsService.getSearchWord(name, this.isProduct)
      .then(this.handleItemsSearched.bind(this))
      .catch((err) => observableThrowError(true));
  }

  /**
   * Search services by sector id
   * @param sector 
   */
  getServicesBySector(sector: number) {
    this.itemsService.getServicesSector(sector)
      .then(this.handleItemsSearched.bind(this))
      .catch((err) => observableThrowError(true));
  }

  /**
   * Validates if there are any results
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

  /**
   * Handle the parameters sent and validates which type of search was made and gets the data
   * @param type 
   * @param value 
   */
  handleSearchData(type: any, value: any) {
    switch (type) {
      case 'group':
        this.getProductsbyGroup(value);
        this.breadcrumbService.addBreadCrumb({
          page: 'Por espacio de uso',
          href: `/#/catalog/principal-page-consultant/itemlist?type=group&value=${value}`
        });
      break;
      case 'search':
        this.getSearchedByWord(value);
        this.breadcrumbService.addBreadCrumb({
          page: 'Busqueda',
          href: `/#/catalog/principal-page-consultant/itemlist?type=search&value=${value}`
        });
      break;
      case 'category':
        this.getProductsbyCategory(value);
        this.breadcrumbService.addBreadCrumb({
          page: 'Por ISO 9999',
          href: `/#/catalog/principal-page-consultant/itemlist?type=category&value=${value}`
        });
      break;  
      case 'sector':
        this.getServicesBySector(value);
        this.breadcrumbService.addBreadCrumb({
          page: 'Sector',
          href: `/#/catalog/principal-page-consultant/itemlist?type=sector&value=${value}`
        });
      break;
      default:
        break;
    }
  }

  /**
   * Redirects to the show page product or service and sent by parameters the values of the selected item
   * @param item 
   */
  showItem(item: any) {
    this.showItems = false;
    if (item.isProduct) {
      this.router.navigate(['catalog/principal-page-consultant/product/show-product', item.idPk, item.organizationsIdFk]);
    } else if (!item.isProduct) {
      this.router.navigate(['catalog/principal-page-consultant/service/show-service', item.idPk, item.organizationsIdFk]);
    }
  }
}
export { ItemsListComponent }
