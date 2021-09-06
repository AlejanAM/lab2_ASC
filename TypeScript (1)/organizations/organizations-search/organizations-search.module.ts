import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { OrganizationsSearchRoutingModule,routedComponents } from './organizations-search.rounting';
import { OrganizationSearchWordComponent } from './search-by-word/organization-search-by-word.component';
import { OrganizationSearchRegionComponent } from './search-by-regions/organizations-search-by-regions.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrganizationsSearchRoutingModule
  ],
  declarations: [
    routedComponents,
    OrganizationSearchWordComponent,
    OrganizationSearchRegionComponent
  ],
  exports: [
    routedComponents,
    OrganizationSearchWordComponent,
    OrganizationSearchRegionComponent
  ]
})
export class OrganizationsSearchModule {}
