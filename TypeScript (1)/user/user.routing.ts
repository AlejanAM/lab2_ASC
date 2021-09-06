import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserInspectComponent } from './user-inspect/user-inspect.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersStateAceptedComponent } from './state/acepted-state/acepted-state.component';
import { UsersStatePendingComponent } from './state/pending-state/pending-state.component';
import { UsersStateRejectedComponent } from './state/rejected-state/rejected-state.component';

const routes: Routes = [
  {
    path: 'user-inspect/:userAdmiIdPk/:userIdPk',
    component: UserInspectComponent
  },
  {
    path: 'show-user/:userIdPk/:crudId',
    component: UserDetailComponent
  },
  {
    path: 'acepted-users',
    data: { breadCrumb: '' },
    children : [
      {
        path: '',
        component: UsersStateAceptedComponent,
        data : { breadCrumb: 'Aceptados' }
      },
      {
        path: 'user-inspect/:userAdmiIdPk/:userIdPk',
        component: UserInspectComponent,
        data : { breadCrumb: 'Información de usuario' }
      }
    ]
  },
  {
    path: 'pending-users',
    data: { breadCrumb: '' },
    children : [
      {
        path: '',
        component: UsersStatePendingComponent,
        data : { breadCrumb: 'Pendientes' }
      },
      {
        path: 'user-inspect/:userAdmiIdPk/:userIdPk',
        component: UserInspectComponent,
        data : { breadCrumb: 'Información de usuario' }
      }
    ]
  },
  {
    path: 'rejected-users',
    data: { breadCrumb: '' },
    children : [
      {
        path: '',
        component: UsersStateRejectedComponent,
        data: { breadCrumb: 'Rechazados' }
      },
      {
        path: 'user-inspect/:userAdmiIdPk/:userIdPk',
        component: UserInspectComponent,
        data : { breadCrumb: 'Información de usuario' }
      }
    ]
  }
];

export const UserRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [
  UserInspectComponent,
  UserDetailComponent,
  UsersStateAceptedComponent,
  UsersStatePendingComponent,
  UsersStateRejectedComponent
];
