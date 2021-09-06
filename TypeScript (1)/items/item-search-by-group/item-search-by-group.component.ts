
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ItemsService } from '../items.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-item-search-group',
  templateUrl: './item-search-by-group.component.html',
  styleUrls: ['../../common/styles/style.scss'],
  providers: [ItemsService]
})

class ItemSearchGroupComponent implements OnInit {

  @Input()
  isShowing: boolean;

  @Output()
  changeShowState: EventEmitter<any> = new EventEmitter<any>();

  public groups: any;
  public groupsSearch1: any;
  public groupsSearch2: any;
  public groupsSearch3: any;
  public itemsSearched: any;
  public isFirstLevelHide: boolean;
  public isFirstLevelBack: boolean;
  public firstLevelSelected: number;
  public isSecondLevelHide: boolean;
  public isSecondLevelBack: boolean;
  public secondLevelSelect: number;
  public isThirdLevelHide: boolean;
  public thirdLevelSelect: number;

  constructor(private _itemsService: ItemsService,
    private _route: ActivatedRoute,
    private router: Router) {
    this.groups = {};
    this.groupsSearch1 = [];
    this.groupsSearch2 = [];
    this.groupsSearch3 = [];
    this.isFirstLevelHide = false;
    this.isFirstLevelBack = false;
    this.firstLevelSelected = null;
    this.isSecondLevelHide = false;
    this.secondLevelSelect = null;
    this.isSecondLevelBack = false;
    this.isThirdLevelHide = false;
    this.thirdLevelSelect = null;
  }

  ngOnInit() {
    this._itemsService.getSearchGroup(0, 0)
      .then(this.handleGroupSearch1.bind(this))
      .catch((err) => observableThrowError(true));
  }

  selectGroup(groupId: any) {
    this.isShowing = true;
    let emitObj = {
      show: this.isShowing,
      group: Number(groupId.idPk),
      name : groupId.name,
      type: 0
    };
    this.changeShowState.emit(emitObj);
  }

  getSearchLevel2(father: number) {
    this.groupsSearch2 = [];
    this.groupsSearch3 = [];
    this.itemsSearched = [];
    this.isSecondLevelHide = false;
    this.secondLevelSelect = null;
    this.isThirdLevelHide = false;
    this.thirdLevelSelect = null;
    if (this.firstLevelSelected != null) {
      this.isFirstLevelBack = true;
      this.isFirstLevelHide = false;
      this.firstLevelSelected = null;
    } else {
      this.isFirstLevelHide = true;
      this.isFirstLevelBack = false;
      this.firstLevelSelected = father;
      this._itemsService.getSearchGroup(father, 1)
        .then(this.handleGroupsSearch2.bind(this))
        .catch((err) => observableThrowError(true));
    }
  }

  getSearchLevel3(father: number) {
    this.groupsSearch3 = [];
    this.itemsSearched = [];
    this.isThirdLevelHide = false;
    this.thirdLevelSelect = null;
    if (this.secondLevelSelect !== null) {
      this.isSecondLevelBack = true;
      this.isSecondLevelHide = false;
      this.secondLevelSelect = null;
    } else {
      this.isSecondLevelHide = true;
      this.isSecondLevelBack = false;
      this.secondLevelSelect = father;
      this._itemsService.getSearchGroup(father, 2)
        .then(this.handleGroupsSearch3.bind(this))
        .catch((err) => observableThrowError(true));
    }
  }

  getProductsbyGroup(father: number) {
    this.isThirdLevelHide = true;
    this.thirdLevelSelect = father;
    this._itemsService.getProductsGroups(father)
      .then(this.handleSearchedByGroup.bind(this))
      .catch((err) => {
        return observableThrowError(true);
      });
  }

  handleSearchedByGroup(response: any) {
    this.itemsSearched = response;
  }

  handleGroupSearch1(response: any) {
    this.groups.bathCategory = response[0];
    this.groups.feedingCategory = response[1];
    this.groups.livingPlaceCategory = response[2];
    this.groups.therapyCategory = response[3];
    this.groups.technologyCategory = response[4];
    this.groups.jobCategory = response[5];
    this.groups.mobilityCategory = response[6];
    this.groups.clothingCategory = response[7];
    this.groups.recreationCategory = response[8];
    this.groups.sportCategory = response[9];
    this.groups.trainingCategory = response[10];
    this.groups.artCategory = response[11];
    this.groups.manyCategory = response[12];
  }

  handleGroupsSearch2(response: any) {
    this.groupsSearch2 = response;
  }

  handleGroupsSearch3(response: any) {
    this.groupsSearch3 = response;
  }

  showFirstLevel(itemId: any) {
    if ((this.firstLevelSelected === itemId && !this.isFirstLevelBack) || !this.isFirstLevelHide) {
      return false;
    } else {
      return true;
    }
  }

  showSecondLevel(itemId: any) {
    if ((this.secondLevelSelect === itemId && !this.isSecondLevelBack) || !this.isSecondLevelHide) {
      return false;
    } else {
      return true;
    }
  }

  showThirdLevel(itemId: any) {
    if (this.thirdLevelSelect === itemId || !this.isThirdLevelHide) {
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
export { ItemSearchGroupComponent }
