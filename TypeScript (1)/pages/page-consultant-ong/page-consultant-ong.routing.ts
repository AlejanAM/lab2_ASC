import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageConsultantONGComponent } from './page-consultant-ong.component';

const routes: Routes = [{
  path: 'page-consultant-ong',
  data: { breadCrumb: 'ONG'},
  component : PageConsultantONGComponent,
  children : [
    {
      path: '',
      data: { breadCrumb: ''},
      loadChildren: "app/catalog/organizations/organizations-search/organizations-search.module#OrganizationsSearchModule"
    }
  ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
  imports: [routing],
  exports: [RouterModule],
  providers: []
})

export class PageRoutingModule {}

export const routedComponents = [PageConsultantONGComponent];
