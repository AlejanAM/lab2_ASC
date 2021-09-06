import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemsService } from '../items.service';

@Component({
  selector: 'app-items-searched-word',
  templateUrl: './item-search-by-name.component.html',
  styleUrls: [
    '../../common/styles/style.scss',
  ],
  providers: [ItemsService]
})
class ItemsSearchWordComponent {

  @Input()
  isShowing: boolean;

  @Output()
  changeShowState: EventEmitter<any> = new EventEmitter<any>();

  public itemsSearched: any;
  public name: string;

  constructor(private _itemsService: ItemsService,
  private _route: ActivatedRoute,
  private router: Router) { }

  searchProductByName() {
    if (this.name) {
      this.isShowing = true;
      let emitObj = {
        show: this.isShowing,
        name: this.name,
        type: 1
      };
      this.changeShowState.emit(emitObj);
    }
  }

  handleSearchedByWord(response: any) {
    this.itemsSearched = response;
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
export { ItemsSearchWordComponent }
