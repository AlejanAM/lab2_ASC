import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {RouterModule} from '@angular/router';

import {
  SuperUserRoutingModule,
  routedComponents,
} from './page-super-user.routing';
import {UserModule} from '../../user/user.module';
import {ProfileModule} from '../../profile/profile.module';
import {LayoutModule} from '../../../layout/layout.module';
import {PipesModule} from '../../../pipes/pipes.module';
import {UtilsModule} from '../../../utils/utils.module';
import {DirectivesModule} from '../../../directives/directives.module';
import {OrganizationsModule} from '../../organizations/organizations.module';
import {NewOrganizationComponent} from './new-organization/new-organization.component';
import {ModalUserOrganizationsComponent} from './list-organization/modal-user-organizations/modal-user-organizations.component';
import {ConfirmationModalComponent} from './list-organization/confirmation-modal/confirmation-modal.component';
import {ConfirmationModalService} from './list-organization/confirmation-modal/confirmation-modal.service';
import {CreateReportComponent} from './create-report/create-report.component';
import {ConfirmationUpdateService} from './view-list-users/confirmation-modal/confirmation-update.service';
import {ConfirmationUpdateComponent} from './view-list-users/confirmation-modal/confirmation-update.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule,
    SuperUserRoutingModule,
    UserModule,
    ProfileModule,
    LayoutModule,
    PipesModule,
    UtilsModule,
    OrganizationsModule,
    DirectivesModule,
  ],
  declarations: [
    routedComponents,
    NewOrganizationComponent,
    ModalUserOrganizationsComponent,
    ConfirmationModalComponent,
    CreateReportComponent,
    ConfirmationUpdateComponent,
  ],
  exports: [routedComponents],
  providers: [ConfirmationModalService, ConfirmationUpdateService],
})
export class SuperUserPageModule {}
