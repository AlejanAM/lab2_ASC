import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemModule } from './item/item.module';
import { ItemSearchCategoryComponent } from './item-search-by-category/item-search-by-category.component';
import { ItemSearchGroupComponent } from './item-search-by-group/item-search-by-group.component';
import { ItemsSearchWordComponent } from './item-search-by-name/item-search-by-name.component';
import { ItemSearchSectorComponent } from './item-search-by-sector/item-search-by-sector.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ItemModule
  ],
  declarations: [
    ItemSearchCategoryComponent,
    ItemSearchGroupComponent,
    ItemsSearchWordComponent,
    ItemSearchSectorComponent
  ],
  exports: [
    ItemModule,
    ItemSearchCategoryComponent,
    ItemSearchGroupComponent,
    ItemsSearchWordComponent,
    ItemSearchSectorComponent
  ]
})
export class ItemsModule {}
