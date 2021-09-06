import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotificationComponent } from './notification/notification.component';
import { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    NotificationComponent,
    NotificationsComponent
  ],
  exports: [
    NotificationComponent,
    NotificationsComponent
  ]
})
export class NotificationsModule {}
