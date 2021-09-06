import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'muirwizard';

import { DefaultComponent } from '../default/default.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule
  ],
  declarations: [
    DefaultComponent
  ],
  exports: [
    DefaultComponent
  ]
})
export class DefaultModule {}
