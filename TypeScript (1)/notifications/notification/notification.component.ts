import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: [
    '../notifications.component.scss',
    '../../common/styles/style.scss'
  ]
})

class NotificationComponent {
  @Input() notification: {
    title: string,
    description: string,
    dateNotification: string,
    viewed: boolean
  };

  constructor(public _route: Router) { }
}
export { NotificationComponent }
