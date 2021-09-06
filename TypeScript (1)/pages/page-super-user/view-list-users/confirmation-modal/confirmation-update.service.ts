import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ConfirmationUpdateService {
  constructor() {}

  private subject = new Subject<any>();
  alertThis(message: string, type: string, siFn: () => void) {
    this.setAlert(message, type, siFn);
  }

  setAlert(message: string, type: string, siFn: () => void) {
    let that = this;
    that.subject.next({
      type: type,
      text: message,
      siFn: function () {
        siFn();
        that.subject.next();
      },
    });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
