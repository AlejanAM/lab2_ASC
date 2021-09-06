import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, NgModel } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

import { OrganizationsModule } from '../organizations/organizations.module';
import { PagesRoutingModule,routedComponents } from './pages.routing';
import { DefaultModule } from '../default/default.module';
import { UserModule } from '../user/user.module';
import { ItemsModule } from '../items/items.module';
import { LayoutModule } from '../../layout/layout.module';
import { PageConsultantONGModule } from './page-consultant-ong/page-consultant-ong.module';
import { PageDashBoardModule } from './page-dashboard/page-dashboard.module';
import { ProductViewsComponent } from './page-consultant/product-views/product-views.component';
import { ServicesViewsComponent } from './page-consultant/services-views/services-views.component';
import { BreadcrumbService } from '../../shared/breadcrumb.service'

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule,
    UserModule,
    ItemsModule,
    OrganizationsModule,
    LayoutModule,
    DefaultModule,
    PageConsultantONGModule,
    PageDashBoardModule,
    PagesRoutingModule
  ],
  declarations: [
    routedComponents,
    ProductViewsComponent,
    ServicesViewsComponent
  ],
  exports: [
    routedComponents
  ],
  providers: [
    BreadcrumbService
  ],
})
export class PrincipalPagesModule {}
