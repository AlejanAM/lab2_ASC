import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatalogComponent } from './catalog.component';
import { OrganizationsInspectComponent } from './organizations/organization-inspect/organization-inspect.component';
import { OrganizationCreateComponent } from './organizations/organization-create/organization-create.component';
import { OrganizationUpdateComponent } from './organizations/organization-update/organization-update.component';
import { PageDashBoardComponent } from './pages/page-dashboard/page-dashboard.component';
import { DefaultAdministratorComponent } from './pages/page-dashboard/default/default.component';
import { ProductCreateComponent } from './items/item/product/create/product-create.component';
import { ServiceCreateComponent } from './items/item/service/create/service-create.component';
import { AuthGuardService } from '../auth/services/auth-guard.service';

export const routes: Routes = [{
    path: 'organization-inspect/:userIdPk/:organizationIdPk',
    component: OrganizationsInspectComponent
  }, {
    path: 'organization-create/:userIdPk',
    component: OrganizationCreateComponent
  }, {
    path: 'organization-update/:userIdPk/:organizationIdPk',
    component: OrganizationUpdateComponent
  }, {
    path: '',
    component: CatalogComponent,
    children: [
      {
        path: 'page-dashboard',
        component: PageDashBoardComponent,
        loadChildren: 'app/catalog/pages/page-dashboard/page-dashboard.module#PageDashBoardModule'
      }
    ],
  },
];

export const CatalogRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [
  CatalogComponent
];
