import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationSearchComponent } from './organizations-search.component';
import { OrganizationResulListComponent } from './organizations-result-lists/organizations-result-lists.component';

const routes: Routes = [
  {
    path: '',
    data: { breadCrumb: ''},
    children: [
      {
        path: '',
        data: { breadCrumb: ''},
        component: OrganizationSearchComponent,
      },
      {
        path: 'organization-result',
        component: OrganizationResulListComponent,
        data: {breadCrumb: 'Resultado de la busqueda'},
      },
      {
        path: 'organization-view/:organizationIdPk',
        loadChildren: 'app/catalog/organizations/organization-view/organization-view.module#OrganizationViewModule',
        data: { breadCrumb: 'Información de la Entidad' }
      }
    ]
  }
];

export const OrganizationsSearchRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [
  OrganizationSearchComponent,
  OrganizationResulListComponent
];
