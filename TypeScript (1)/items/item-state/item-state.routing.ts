import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsStateComponent } from './item-state.component';

const routes: Routes = [
  {
    path: 'item-list',
    component: ItemsStateComponent,
    data: { breadCrumb: 'Lista de Items' }
  },
  {
    path: '',
    loadChildren: 'app/catalog/items/item/service/service.module#ServiceModule',
    data: { breadCrumb: 'Servicios' }
  },
  {
    path: '',
    loadChildren: 'app/catalog/items/item/product/product.module#ProductModule',
    data: { breadCrumb: 'Producto' }
  }
];

export const ItemsStateRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [
  ItemsStateComponent
];
