import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import {
  FormsModule,
  NgModel,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPaginationModule } from 'ngx-pagination';

import './user.component.scss';

import { UserUpdateComponent } from './user-update/user-update.component';

import { UserService } from './user.service';

import { PipesModule } from '../../pipes/pipes.module';
import { LayoutModule } from '../../layout/layout.module';
import { UtilsModule } from '../../utils/utils.module';
import { UserRoutingModule,routedComponents } from './user.routing';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TextMaskModule,
    UserRoutingModule,
    UtilsModule,
    LayoutModule,
    DirectivesModule,
    PipesModule,
    NgxPaginationModule,
  ],
  declarations: [
    UserUpdateComponent,
    routedComponents
  ],
  providers: [UserService],
  exports: [
    routedComponents
  ]
})
export class UserModule {}
