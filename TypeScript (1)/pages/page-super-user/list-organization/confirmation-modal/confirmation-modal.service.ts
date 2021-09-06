import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class ConfirmationModalService {
  constructor() { }

  /**
   * Gets the data send, type and function
   * @param message 
   * @param type 
   * @param siFn 
   */
  private subject = new Subject<any>();
  alertThis(message: string, type: string, siFn: () => void) {
      this.setAlert(message, type, siFn);
  }

   /**
   * Sets the data send by parameter into a subject
   * @param message 
   * @param type 
   * @param siFn 
   */
  setAlert(message: string, type: string, siFn: () => void) {
      let that = this;
      that.subject.next({
          type: type,
          text: message,
          siFn: function () {
              siFn();
              that.subject.next(); 
          }
      });
  }

   /**
   * Return the subject as an observable
   */
  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }

}
