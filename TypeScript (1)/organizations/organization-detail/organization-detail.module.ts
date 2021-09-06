import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationsDetailComponent } from './organization-detail.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OrganizationsDetailComponent
  ],
  exports: [
    OrganizationsDetailComponent
  ]
})
export class OrganizationDetailModule {}
