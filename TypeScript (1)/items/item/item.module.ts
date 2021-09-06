import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ItemComponent} from './item.component';

import {ServiceModule} from './service/service.module';
import {ProductModule} from './product/product.module';

import {ItemService} from './item.service';
import {SharedService} from '../../../shared/shared.service';
import {PipesModule} from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    ProductModule,
    PipesModule,
  ],
  declarations: [ItemComponent],
  exports: [ServiceModule, ProductModule, ItemComponent],
  providers: [ItemService, SharedService],
})
export class ItemModule {}
