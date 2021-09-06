import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, FormArray, FormControl} from '@angular/forms';

import {BreadcrumbService} from '../../../../shared/breadcrumb.service';
import {PageSuperUserService} from '../page-super-user.service';
import {SP_MODULES, REPORT_LABELS} from '../../pages.constants';
import {ModalNotificationService} from '../../../../utils/modal/notifications/modal-notifications.service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss'],
  providers: [PageSuperUserService, ModalNotificationService]
})
export class CreateReportComponent implements OnInit {
  public itemBreadCrumb: any;
  public modules: any;
  public editorForm: FormGroup;
  public htmlLabels: any;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private pageSuperUserService: PageSuperUserService,
    private notificationService: ModalNotificationService
  ) {
    this.itemBreadCrumb = [];
    this.breadcrumbService.breadCrumbArray.subscribe((response) => {
      this.itemBreadCrumb = response;
    });
    this.modules = SP_MODULES;
    this.htmlLabels = REPORT_LABELS;
  }

  /**
   * Creates the form configuration.
   */
  private formConfiguration() {
    this.editorForm = this.formBuilder.group({
      modules: ['']
    });
  }

  ngOnInit() {
    this.addBreadcrumb();
    this.formConfiguration();
  }

  /**
   * Add the routes for the breadcrumb array based on the type of view
   */
  private addBreadcrumb() {
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/catalog/principal-page-super-user'
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Reportes',
      href: '/#/catalog/principal-page-super-user'
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Crear nuevo',
      href: `/#${this.activatedRoute.snapshot['_routerState'].url}`
    });
  }

  /**
   * Validates based on the module selected and downloads the
   * file of users on that module
   */
  public generateReports(module) {
    this.pageSuperUserService.getModulesUsersReport(module.modules).then((response) => {
      if (response !== 'empty') {
        this.showFile(`${response}.xlsx`);
      } else {
        this.notificationService.alertThis(`No se han encontrado usuarios`, 'error', () => {});
      }
    });
  }

  /**
   * Downloads a file and then opens a window with it
   * @param fileName
   */
  private showFile(fileName) {
    const pdfSrc = this.pageSuperUserService.getFile('reports', fileName);
    window.open(pdfSrc, '_blank');
  }
}
