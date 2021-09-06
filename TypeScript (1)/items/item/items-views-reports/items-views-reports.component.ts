import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ModalNotificationService} from '../../../../utils/modal/notifications/modal-notifications.service';
import {BreadcrumbService} from '../../../../shared/breadcrumb.service';
import {ItemService} from '../item.service';

@Component({
  selector: 'app-items-views-reports',
  templateUrl: './items-views-reports.component.html',
  styleUrls: ['./items-views-reports.component.scss'],
  providers: [ModalNotificationService]
})
export class ItemsViewsReportsComponent implements OnInit {
  public editorForm: FormGroup;
  public startDate: any;
  public validStartDate: boolean;
  public validEndDate: boolean;
  public isItem: boolean;
  public viewType: any;
  public sectionStep: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notificationService: ModalNotificationService,
    private breadcrumbService: BreadcrumbService,
    private itemService: ItemService
  ) {
    this.startDate = '';
    this.validStartDate = true;
    this.validEndDate = true;
    this.isItem = false;
    this.sectionStep = 2;
  }

  ngOnInit() {
    this.validateParams();
    this.formConfiguration();
    this.addBreadCrumb();
  }

  /**
   * Creates the form configuration.
   */
  private formConfiguration() {
    this.editorForm = this.formBuilder.group({
      filter: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  /**
   * Add the routes for the breadcrumb array
   */
  private addBreadCrumb() {
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/catalog/page-dashboard'
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Generar Informe',
      href: `/#${this.activatedRoute.snapshot['_routerState'].url}`
    });
  }

  /**
   * Validates which type of param was sent
   */
  private validateParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.viewType = params.type;
    });
  }

  /**
   *  Sets the new startDate
   * @param startDate
   */
  public dateChange(startDate) {
    this.startDate = startDate;
  }

  /**
   * Validates based on the type or file selected and downloads the corresponding one
   * (Temporary solution since the first version of sicid "mejoras" its only frontend)
   */
  public generateReports(credencials) {
    this.validStartDate = true;
    this.validEndDate = true;
    let errorCount = 0;

    if (this.editorForm.valid) {
      switch (this.viewType) {
        case '1':
          this.getViewsReports(credencials);
          break;
        case '2':
          this.getQuantityFile(credencials);
          break;
        case '3':
          this.getProvidersFile(credencials);
          break;
      }
    } else {
      errorCount = this.validateLocationControls();
      this.notificationService.alertThis(
        `Campos requeridos incompletos: ${errorCount}`,
        'error',
        () => {}
      );
    }
  }

  /**
   * Returns the views report for organizations
   * @param filter
   */
  private getViewsReports(credencials) {
    if (credencials.filter === '') {
      credencials.filter = 1;
    }
    this.itemService
      .getItemsReports(
        credencials.filter,
        credencials.startDate,
        credencials.endDate,
        'getViewsItemReport'
      )
      .then((response) => {
        if (response.item !== 'empty') {
          this.showFile(`${response.item}.xlsx`);
        } else {
          this.notificationService.alertThis(`No se han encontrado datos`, 'error', () => {});
        }
      });
  }

  /**
   * Validates the filter and returns a correspondent file
   * @param filter
   */
  private getProvidersFile(credencials) {
    if (credencials.filter === '') {
      credencials.filter = 1;
    }
    this.itemService
      .getItemsReports(
        credencials.filter,
        credencials.startDate,
        credencials.endDate,
        'getItemProvidersReport'
      )
      .then((response) => {
        if (response.item !== 'empty') {
          this.showFile(`${response.item}.xlsx`);
        } else {
          this.notificationService.alertThis(`No se han encontrado datos`, 'error', () => {});
        }
      });
  }

  /**
   * Validates the filter and returns a correspondent file
   * @param filter
   */
  private getQuantityFile(credencials) {
    if (credencials.filter === '') {
      credencials.filter = 1;
    }
    this.itemService
      .getItemsReports(
        credencials.filter,
        credencials.startDate,
        credencials.endDate,
        'getItemAmountsReport'
      )
      .then((response) => {
        if (response.item !== 'empty') {
          this.showFile(`${response.item}.xlsx`);
        } else {
          this.notificationService.alertThis(`No se han encontrado datos`, 'error', () => {});
        }
      });
  }

  /**
   * Downloads a file and then opens a window with it
   * @param fileName
   */
  private showFile(fileName) {
    const pdfSrc = this.itemService.getFile('reports', fileName);
    window.open(pdfSrc, '_blank');
  }

  /**
   * Validates if the credencials of the location option are valid
   */
  private validateLocationControls() {
    let countError = 0;
    if (this.editorForm.controls.startDate.errors) {
      this.validStartDate = false;
      countError++;
    }
    if (this.editorForm.controls.endDate.errors) {
      this.validEndDate = false;
      countError++;
    }
    return countError;
  }
}
