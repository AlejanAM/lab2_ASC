import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'muirwizard';

import { AppRoutingModule, routedComponents } from './page-dashboard.routing';
import { UtilsModule } from '../../../utils/utils.module';
import { LayoutModule } from '../../../layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LayoutModule,
    UtilsModule,
    ArchwizardModule
  ],
  declarations: [
    routedComponents
  ],
  exports: [routedComponents]
})
export class PageDashBoardModule {}
