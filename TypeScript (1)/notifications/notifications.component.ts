import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: [
    './notifications.component.scss',
    '../common/styles/style.scss'
  ],
  providers: [
    NotificationsService
  ]
})
class NotificationsComponent implements OnInit {

  public notifications: any;
  public idNotifications: any;
  public idUser: number;
  public isNewNotification: boolean;
  public isEmpty: boolean;

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
    private _route: ActivatedRoute
  ) {
    this.notifications = [];
    this.idNotifications = [];
    this.isNewNotification = true;
    this.isEmpty = true;
  }

  ngOnInit() {
    this.idUser = +localStorage.getItem('userId');
    this.notificationsService.getNewsNotifications(this.idUser)
      .then(this.handleNotifications.bind(this))
      .catch(this.catchShowNotificationsError);
  }

  handleNotifications(response: any) {
    if (response.length > 0) {
      response.map((notification) => {
        if (notification.organizationName === null && notification.itemName !== null) {
          this.isEmpty = false;
          this.notifications.push({
            title: `Item: ${notification.itemName}`,
            description: notification.descriptionEvaluation,
            dateNotification: notification.dateEvaluation,
            viewed: notification.viewed
          });
        } else if (notification.organizationName !== null && notification.itemName === null) {
          this.isEmpty = false;
          this.notifications.push({
            title: `Entidad:  ${notification.organizationName}`,
            description: notification.descriptionEvaluation,
            dateNotification: notification.dateEvaluation,
            viewed: notification.viewed
          });
        } else if (notification.userName) {
          this.isEmpty = false;
          this.notifications.push({
            title: notification.userName,
            description: notification.descriptionEvaluation,
            dateNotification: notification.dateEvaluation,
            viewed: notification.viewed
          });
        }
        if (!notification.viewed) {
          this.isNewNotification = false;
        }
        this.idNotifications.push(notification.idPk);
      });
    } else {
      this.isEmpty = true;
    }
  }

  catchShowNotificationsError(err: any) {
    console.log(err);
  }

  hideNotifications() {
    this.isNewNotification = true;
    this.notificationsService.updatedNotificationsViewed(this.idNotifications);
  }

}
export { NotificationsComponent }
