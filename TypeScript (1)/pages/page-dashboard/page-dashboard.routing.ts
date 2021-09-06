import {NgModule} from '@angular/core';
import {Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ProductCreateComponent} from '../../items/item/product/create/product-create.component';
import {ServiceCreateComponent} from '../../items/item/service/create/service-create.component';
import {PageDashBoardComponent} from './page-dashboard.component';
import {DefaultAdministratorComponent} from './default/default.component';
import {ItemsViewsReportsComponent} from '../../items/item/items-views-reports/items-views-reports.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultAdministratorComponent,
    data: {breadCrumb: 'Administrador'},
  },
  {
    path: 'organizations',
    loadChildren:
      'app/catalog/organizations/organizations.module#OrganizationsModule',
    data: {breadCrumb: 'Entidades'},
  },
  {
    path: 'users',
    loadChildren: 'app/catalog/user/user.module#UserModule',
    data: {breadCrumb: 'Usuarios'},
  },
  {
    path: 'item',
    data: {breadCrumb: 'Items'},
    children: [
      {
        path: '',
        loadChildren:
          'app/catalog/items/item-state/item-state.module#ItemsStateModule',
        data: {breadCrumb: ''},
      },
      {
        path: 'create-product/:userIdPk',
        component: ProductCreateComponent,
        data: {breadCrumb: 'Crear Producto'},
      },
      {
        path: 'create-service/:userIdPk',
        component: ServiceCreateComponent,
        data: {breadCrumb: 'Crear Servicio'},
      },
      {
        path: 'views-report/:type',
        component: ItemsViewsReportsComponent,
        data: {breadCrumb: 'Crear reporte'},
      },
    ],
  },
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  imports: [routing],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}

export const routedComponents = [
  PageDashBoardComponent,
  DefaultAdministratorComponent,
  ProductCreateComponent,
  ServiceCreateComponent,
  ItemsViewsReportsComponent,
];
