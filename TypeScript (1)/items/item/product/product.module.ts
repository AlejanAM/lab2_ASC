import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ShareButtonsOptions, IShareButtons } from '@ngx-share/core';

import { UtilsModule } from '../../../../utils/utils.module';
import { ArchwizardModule } from 'muirwizard';
import { NgxPaginationModule } from 'ngx-pagination';

import { ItemService } from '../item.service';

import { LayoutModule } from '../../../../layout/layout.module';

import { ProductRoutingModule,routedComponents } from './product.routing';
import { ItemShowModalModule } from '../modal/item-show-modal.module';

const customOptions: ShareButtonsOptions = {
  include: ['facebook', 'twitter'],
  exclude: [],
  theme: 'modern-light',
  gaTracking: true,
  autoSetMeta: true,
  twitterAccount: 'username'
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ArchwizardModule,
    ProductRoutingModule,
    ItemShowModalModule,
    LayoutModule,
    NgxPaginationModule,
    UtilsModule,
    ShareButtonsModule
      .forRoot({
        options: customOptions,
      }),
  ],
  declarations: [
    routedComponents
  ],
  exports: [
    routedComponents
  ],
  providers: [
    ItemService,
  ],
})
export class ProductModule {}
