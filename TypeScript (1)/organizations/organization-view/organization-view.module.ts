import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationViewRoutingModule, routedComponents } from './organization-view.routing';
import { OrganizationDetailModule } from '../organization-detail/organization-detail.module';

@NgModule({
  imports: [
    CommonModule,
    OrganizationViewRoutingModule,
    OrganizationDetailModule
  ],
  declarations: [
    routedComponents
  ],
  exports: [
    routedComponents
  ]
})
export class OrganizationViewModule {}
