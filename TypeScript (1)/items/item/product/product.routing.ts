import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductUpdateComponent } from './update/product-update.component';
import { ProductShowComponent } from './show/product-show.component';
import { ProductComponent } from './product.component';
import { ItemProductInspectComponent } from '../../item-inspect-product/item-inspect-product.component';

const routes: Routes = [
  {
    path: 'product/:userIdPk',
    component: ProductComponent
  },
  {
    path: 'item-product-inspect/:userIdPk/:itemIdPk',
    component: ItemProductInspectComponent,
    data: { breadCrumb: 'Inspeccionar Producto' }
  },
  {
    path: 'show-product/:item/:organizationId/:userIdPk',
    component: ProductShowComponent,
    data: { breadCrumb: 'Consultar Producto' }
  },
  {
    path: 'show-product/:item/:userIdPk',
    component: ProductShowComponent,
    data: { breadCrumb: 'Consultar Producto' }
  },
  { 
    path: 'update-product/:item/:organizationId/:userIdPk',
    component: ProductUpdateComponent,
    data: { breadCrumb: 'Actualizar Producto' }
  }
];

export const ProductRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [
  ProductComponent,
  ItemProductInspectComponent,
  ProductShowComponent,
  ProductUpdateComponent
];
