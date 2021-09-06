import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';

import {ProfileComponent} from './profile.component';
import {ProfileUpdateComponent} from './update/profile-update.component';

import {LayoutModule} from '../../layout/layout.module';
import {UtilsModule} from '../../utils/utils.module';
import {ProfileRoutingModule} from './profile.routing';
import {DirectivesModule} from '../../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    TextMaskModule,
    ProfileRoutingModule,
    UtilsModule,
    LayoutModule,
    DirectivesModule,
  ],
  declarations: [ProfileComponent, ProfileUpdateComponent],
  exports: [ProfileComponent],
})
export class ProfileModule {}
