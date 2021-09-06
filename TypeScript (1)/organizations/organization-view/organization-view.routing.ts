import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationViewComponent } from './organization-view.component'

const routes: Routes = [
  {
    path: '',
    component: OrganizationViewComponent,
    data: {breadCrumb: ''}
  }
];

export const OrganizationViewRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [
  OrganizationViewComponent
];
