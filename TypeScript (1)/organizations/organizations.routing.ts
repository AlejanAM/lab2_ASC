import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {OrganizationsInspectComponent} from './organization-inspect/organization-inspect.component';
import {OrganizationCreateComponent} from './organization-create/organization-create.component';
import {OrganizationUpdateComponent} from './organization-update/organization-update.component';
import {OrganizationsStateAceptedComponent} from './state/acepted-state/acepted-state.component';
import {OrganizationsStateRejectedComponent} from './state/rejected-state/rejected-state.component';
import {OrganizationsStatePendingComponent} from './state/pending-state/pending-state.component';
import {OrganizationsReportsComponent} from './organizations-reports/organizations-reports.component';

const routes: Routes = [
  {
    path: 'organization-inspect/:userIdPk/:organizationIdPk/:state',
    component: OrganizationsInspectComponent,
  },
  {
    path: 'organization-create/:userIdPk',
    component: OrganizationCreateComponent,
  },
  {
    path: 'organization-view/:userIdPk/:organizationIdPk',
    loadChildren:
      'app/catalog/organizations/organization-view/organization-view.module#OrganizationViewModule',
  },
  {
    path: 'organization-update/:userIdPk/:organizationIdPk',
    component: OrganizationUpdateComponent,
  },
  {
    path: 'organization-reports/:type',
    component: OrganizationsReportsComponent,
  },
  {
    path: 'acepted-organizations',
    data: {breadCrumb: ''},
    children: [
      {
        path: '',
        component: OrganizationsStateAceptedComponent,
        data: {breadCrumb: 'Aceptadas'},
      },
      {
        path: 'organization-inspect/:organizationIdPk',
        component: OrganizationsInspectComponent,
        data: {breadCrumb: 'Inspeccionar Entidad'},
      },
      {
        path: 'organization-view/:organizationIdPk',
        loadChildren:
          'app/catalog/organizations/organization-view/organization-view.module#OrganizationViewModule',
        data: {breadCrumb: 'Información de la Entidad'},
      },
      {
        path: 'organization-update/:userIdPk/:organizationIdPk',
        component: OrganizationUpdateComponent,
        data: {breadCrumb: 'Actualizar Entidad'},
      },
    ],
  },
  {
    path: 'pending-organizations',
    data: {breadCrumb: ''},
    children: [
      {
        path: '',
        component: OrganizationsStatePendingComponent,
        data: {breadCrumb: 'Pendientes'},
      },
      {
        path: 'organization-inspect/:organizationIdPk',
        component: OrganizationsInspectComponent,
        data: {breadCrumb: 'Inspeccionar Entidad'},
      },
      {
        path: 'organization-view/:organizationIdPk',
        loadChildren:
          'app/catalog/organizations/organization-view/organization-view.module#OrganizationViewModule',
        data: {breadCrumb: 'Información de Entidad'},
      },
      {
        path: 'organization-update/:userIdPk/:organizationIdPk',
        component: OrganizationUpdateComponent,
        data: {breadCrumb: 'Actualizar Entidad'},
      },
    ],
  },
  {
    path: 'rejected-organizations',
    data: {breadCrumb: ''},
    children: [
      {
        path: '',
        component: OrganizationsStateRejectedComponent,
        data: {breadCrumb: 'Rechazadas'},
      },
      {
        path: 'organization-inspect/:organizationIdPk',
        component: OrganizationsInspectComponent,
        data: {breadCrumb: 'Inspeccionar Entidad'},
      },
      {
        path: 'organization-view/:organizationIdPk',
        loadChildren:
          'app/catalog/organizations/organization-view/organization-view.module#OrganizationViewModule',
        data: {breadCrumb: 'Información de la Entidad'},
      },
      {
        path: 'organization-update/:userIdPk/:organizationIdPk',
        component: OrganizationUpdateComponent,
        data: {breadCrumb: 'Actualizar Entidad'},
      },
    ],
  },
];

export const OrganizationRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [
  OrganizationsInspectComponent,
  OrganizationCreateComponent,
  OrganizationUpdateComponent,
  OrganizationsStateAceptedComponent,
  OrganizationsStatePendingComponent,
  OrganizationsStateRejectedComponent,
];
