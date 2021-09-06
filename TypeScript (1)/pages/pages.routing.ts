import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import {
  RouterModule,
  Routes,
  PreloadAllModules
} from '@angular/router';

import { PrincipalPageConsultantComponent } from './page-consultant/page-consultant.component';
import { ItemsListComponent } from './page-consultant/items-list/items-list.component';
import { ProductViewsComponent } from './page-consultant/product-views/product-views.component'
import { ServicesViewsComponent } from './page-consultant/services-views/services-views.component'

export const routes: Routes = [
  {
    path: 'principal-page-super-user',
    children: [
      {
        path: '',
        loadChildren: 'app/catalog/pages/page-super-user/page-super-user.module#SuperUserPageModule',
        data: { breadCrumb: '' }
      }
    ]
  }, {
    path: 'principal-page-consultant',
    component: PrincipalPageConsultantComponent,
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },  {
        path: 'products',
        component: ProductViewsComponent,
      },  {
        path: 'services',
        component: ServicesViewsComponent,
      },  {
        path: 'itemlist',
        component: ItemsListComponent,
      },  {
        path: 'product',
        loadChildren: 'app/catalog/items/item/product/product.module#ProductModule',
        data: { breadCrumb: 'Productos' }
      },  {
        path: 'service',
        loadChildren: 'app/catalog/items/item/service/service.module#ServiceModule',
        data: { breadCrumb: 'Servicios' }
      }, {
        path: '**',
        redirectTo: 'products',
        pathMatch: 'full'
      }
    ]
  }
];

export const PagesRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [
  ItemsListComponent,
  PrincipalPageConsultantComponent,
];
