import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { ItemsStateRoutingModule, routedComponents } from './item-state.routing';
import { UtilsModule } from '../../../utils/utils.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { LayoutModule } from '../../../layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    UtilsModule,
    PipesModule,
    ItemsStateRoutingModule,
    LayoutModule
  ],
  declarations: [
    routedComponents
  ],
  exports: [
    routedComponents
  ]
})
export class ItemsStateModule {}
