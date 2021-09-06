import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { ProfileUpdateComponent } from './update/profile-update.component';

const routes: Routes = [{
    path: 'profile/:userId',
    component: ProfileComponent
  },
  {
    path: 'profile-update/:userId/:roleId',
    component: ProfileUpdateComponent
  }
];

export const ProfileRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
