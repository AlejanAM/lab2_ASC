import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceUpdateComponent } from './update/service-update.component';
import { ServiceShowComponent } from './show/service-show.component';
import { ServiceComponent } from './service.component';
import { ItemServiceInspectComponent } from '../../item-inspect-service/item-inspect-service.component';

const routes: Routes = [
  {
    path: 'service/:userIdPk',
    component: ServiceComponent
  },
  {
    path: 'item-service-inspect/:userIdPk/:itemIdPk',
    component: ItemServiceInspectComponent,
    data: { breadCrumb: 'Inspeccionar Servicio' }
  },
  {
    path: 'show-service/:item/:organizationId/:userIdPk',
    component: ServiceShowComponent,
    data: { breadCrumb: 'Consultar Servicio' }
  },
  {
    path: 'show-service/:item/:userIdPk',
    component: ServiceShowComponent,
    data: { breadCrumb: 'Consultar Servicio' }
  },
  {
    path: 'update-service/:item/:organizationId/:userIdPk',
    component: ServiceUpdateComponent,
    data: { breadCrumb: 'Actualizar Servicio' }
  }
];

export const ServiceRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [
  ServiceComponent,
  ItemServiceInspectComponent,
  ServiceShowComponent,
  ServiceUpdateComponent
];
