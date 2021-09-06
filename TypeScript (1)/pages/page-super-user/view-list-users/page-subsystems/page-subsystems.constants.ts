import { Injectable } from '@angular/core';

@Injectable()
class SubSystemsConstants {


  public static productsServices = 'Productos y Servicios';
  public static igeda = 'IGEDA';
  public static ong = 'Gestión de ONGs';
  public static sitramo = 'SITRAMO';
  public static indicators = 'Indicadores';
  public static enadis = 'ENADIS';
  public static enaho = 'ENAHO';
  public static certifications = 'Gestión de certificaciones';

  public static productsServicesIndex = 0 ;
  public static igedaIndex = 1;
  public static ongIndex = 3;
  public static sitramoIndex = 2;
  public static indicatorsIndex = 5;
  public static enadisIndex = 6;
  public static enahoIndex = 7;
  public static certificationsIndex = 8;

  static __ctor = (() => {
  })();

}
export { SubSystemsConstants }
