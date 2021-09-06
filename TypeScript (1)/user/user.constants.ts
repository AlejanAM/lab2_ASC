import { Injectable } from '@angular/core';

@Injectable()
class UserConstants {
  public static dniNationalMask = [
    /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/
  ];

  public static dniForeignMask = [
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/
  ];
}
export { UserConstants }
