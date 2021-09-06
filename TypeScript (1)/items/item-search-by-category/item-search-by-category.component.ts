
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ItemsService } from '../items.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-item-search-category',
  templateUrl: './item-search-by-category.component.html',
  styleUrls: ['../../common/styles/style.scss'],
  providers: [ItemsService]
})
class ItemSearchCategoryComponent implements OnInit {

  @Input()
  isShowing: boolean;

  @Output()
  changeShowState: EventEmitter<any> = new EventEmitter<any>();

  public categoriesSearch1: any;
  public categoriesSearch2: any;
  public categoriesSearch3: any;
  public divisionName: any;
  public category: number;
  public subCategory: number;
  public division: number;
  public itemsSearched: any;

  constructor(private _itemsService: ItemsService,
    private _route: ActivatedRoute,
    private router: Router) {
    this.categoriesSearch1 = [];
    this.categoriesSearch2 = [];
    this.categoriesSearch3 = [];
    this.divisionName = [];
    this.itemsSearched = [];
    this.category = 0;
    this.subCategory = 0;
    this.division = 0;
  }

  ngOnInit() {
    this._itemsService.getSearchCategorie(0, 0)
      .then(this.handleCategorySearch1.bind(this))
      .catch((err) => {
        return observableThrowError(true);
      });
  }

  getSearchLevel2() {
    this.categoriesSearch2 = [];
    this.categoriesSearch3 = [];
    this.itemsSearched = [];
    this._itemsService.getSearchCategorie(this.category, 1)
    .then(this.handleCategorySearch2.bind(this))
    .catch((err) => {
      return observableThrowError(true);
    });
  }

  getSearchLevel3() {
    this.categoriesSearch3 = [];
    this.itemsSearched = [];
    this._itemsService.getSearchCategorie(this.subCategory, 2)
    .then(this.handleCategorySearch3.bind(this))
    .catch((err) => {
      return observableThrowError(true);
    });
  }

  searchByCategory() {
    this.isShowing = true;
    let emitObj = {
      show: this.isShowing,
      category: this.division,
      name : this.divisionName[this.division],
      type: 2
    };
    this.changeShowState.emit(emitObj);
  }

  handleSearchedByCategorie(response: any) {
    this.itemsSearched = response;
  }

  handleCategorySearch1(response: any) {
    this.categoriesSearch1 = response;
  }

  handleCategorySearch2(response: any) {
    this.categoriesSearch2 = response;
  }

  handleCategorySearch3(response: any) {
    this.categoriesSearch3 = response;
    response.map((division) => {
      this.divisionName[division.idPk] = division.name;
    });
  }

  showItemDetail(item: any) {
    if (item.isProduct) {
      this.router.navigate(['show-product', item.idPk, item.organizationsIdFk], {
        relativeTo: this._route.parent
      });
    } else {
      this.router.navigate(['show-service', item.idPk, item.organizationsIdFk], {
        relativeTo: this._route.parent
      });
    }
  }

}
export { ItemSearchCategoryComponent }
