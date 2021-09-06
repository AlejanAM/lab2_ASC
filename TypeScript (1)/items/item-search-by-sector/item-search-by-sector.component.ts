
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ItemsService } from '../items.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-item-search-sector',
  templateUrl: './item-search-by-sector.component.html',
  styleUrls: ['../../common/styles/style.scss'],
  providers: [ItemsService]
})
class ItemSearchSectorComponent implements OnInit {

  @Input()
  isShowing: boolean;

  @Output()
  changeShowState: EventEmitter<any> = new EventEmitter<any>();

  public isValid: boolean;
  public sector: number;
  public sectors: any;
  public sectorsName: any;
  public itemsSearched: any;
  public isFirstLevelHide: boolean;
  public isFirstLevelBack: boolean;
  public firstLevelSelect: number;

  constructor(private _itemsService: ItemsService,
    private _route: ActivatedRoute,
    private router: Router) {
    this.sectors = [];
    this.sectorsName = [];
    this.isValid = false;
    this.isFirstLevelHide = false;
    this.isFirstLevelBack = false;
    this.firstLevelSelect = null;
    this.sector = 0;
  }

  ngOnInit() {
    this._itemsService.getSearchSector()
      .then(this.handleGroupSearch1.bind(this))
      .catch((err) => {
        return observableThrowError(true);
      });
  }

  onChangeSector() {
    this.isValid = !this.isValid;
  }

  searchBySector() {
    if (this.isValid) {
      this.isShowing = true;
      let emitObj = {
        show: this.isShowing,
        sector: this.sector,
        name : this.sectorsName[this.sector],
        type: 3
      };
      this.changeShowState.emit(emitObj);
    }
  }

  handleSearchedByGroup(response: any) {
    this.itemsSearched = response;
  }

  handleGroupSearch1(response: any) {
    this.sectors = response;
    response.map((sector) => {
      this.sectorsName[sector.idPk] = sector.name;
    });
  }

  showFirstLevel(itemId: number) {
    if ((this.firstLevelSelect === itemId && !this.isFirstLevelBack) || !this.isFirstLevelHide) {
      return false;
    } else {
      return true;
    }
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
export { ItemSearchSectorComponent }
