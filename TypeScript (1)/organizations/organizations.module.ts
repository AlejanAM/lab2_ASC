import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'muirwizard';
import { NgxPaginationModule } from 'ngx-pagination';

import { UtilsModule } from '../../utils/utils.module';
import { PipesModule } from '../../pipes/pipes.module';
import { LayoutModule } from '../../layout/layout.module';
import { DirectivesModule } from '../../directives/directives.module';
import { OrganizationDetailModule } from './organization-detail/organization-detail.module';
import { OrganizationRoutingModule, routedComponents } from './organizations.routing';

import { OrganizationComponent } from './organizations-no-approved/organization/organization.component';
import { OrganizationsNoApprovedComponent } from './organizations-no-approved/organizations-no-approved.component';
import { OrganizationModalComponent } from './modal/organization-modal.component';
import { OrganizationsReportsComponent } from './organizations-reports/organizations-reports.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ArchwizardModule,
    DirectivesModule,
    OrganizationDetailModule,
    OrganizationRoutingModule,
    NgxPaginationModule,
    UtilsModule,
    PipesModule,
    LayoutModule
  ],
  declarations: [
    OrganizationModalComponent,
    OrganizationComponent,
    OrganizationsNoApprovedComponent,
    routedComponents,
    OrganizationsReportsComponent
  ],
  exports: [
    OrganizationComponent,
    OrganizationsNoApprovedComponent,
    routedComponents
  ]
})
export class OrganizationsModule {}
