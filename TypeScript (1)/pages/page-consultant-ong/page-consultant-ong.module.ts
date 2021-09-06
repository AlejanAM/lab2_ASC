import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '../../../layout/layout.module';
import { PageRoutingModule, routedComponents } from './page-consultant-ong.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageRoutingModule,
    LayoutModule
  ],
  declarations: [
    routedComponents
  ],
  exports: [routedComponents]
})
export class PageConsultantONGModule {}
