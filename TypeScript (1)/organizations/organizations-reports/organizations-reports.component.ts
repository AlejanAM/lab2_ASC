import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {OrganizationService} from '../organization.service';
import {
  ORGANIZATIONS_TYPES,
  REPORTS_TYPES,
  ORGANIZATIONS_PROVINCES,
  ORGANIZATIONS_CANTONS,
  ORGANIZATIONS_DISTRICS
} from '../organizations.constants';
import {ModalNotificationService} from '../../../utils/modal/notifications/modal-notifications.service';
import {BreadcrumbService} from '../../../shared/breadcrumb.service';

@Component({
  selector: 'app-organizations-reports',
  templateUrl: './organizations-reports.component.html',
  styleUrls: ['./organizations-reports.component.scss'],
  providers: [OrganizationService, ModalNotificationService]
})
export class OrganizationsReportsComponent implements OnInit {
  public editorForm: FormGroup;
  public organization: boolean;
  public views: boolean;
  public location: boolean;
  public reportsTypes: any;
  public organizationsType: any;
  public provincesArray: any;
  public cantonsArray: any;
  public districsArray: any;
  public validProvince: boolean;
  public validCanton: boolean;
  public validDistric: boolean;
  public viewType: any;
  public selectedCanton: number;
  public selectedDistrict: number;

  constructor(
    private organizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notificationService: ModalNotificationService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.organization = false;
    this.views = false;
    this.location = false;
    this.reportsTypes = REPORTS_TYPES;
    this.organizationsType = ORGANIZATIONS_TYPES;
    this.provincesArray = [];
    this.validProvince = true;
    this.validCanton = true;
    this.validDistric = true;
    this.selectedCanton = 0;
    this.selectedDistrict = 0;
  }

  ngOnInit() {
    this.formConfiguration();
    this.addBreadCrumb();
    this.validateParams();
  }

  /**
   * Gets the provinces
   */
  private loadProvinces() {
    this.organizationService.getNormalListOfModel('Provinces').then((response) => {
      this.provincesArray = response;
    });
  }
  /**
   * Validates which type of param was sent
   */
  private validateParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.viewType = params.type;
      switch (this.viewType) {
        case '1':
          this.organization = false;
          this.views = false;
          this.location = true;
          this.addLocationControls();
          break;
        case '2':
          this.organization = false;
          this.views = true;
          this.location = false;
          this.removeLocationControls();
          break;
        case '3':
          this.organization = true;
          this.views = false;
          this.location = false;
          this.removeLocationControls();
          break;
        default:
          break;
      }
    });
  }

  /**
   * Add the routes for the breadcrumb array
   */
  addBreadCrumb() {
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
   * Creates the form configuration.
   */
  private formConfiguration() {
    this.editorForm = this.formBuilder.group({
      modules: [''],
      filter: [''],
      viewsFilter: ['']
    });
  }

  /**
   * Removes the locations option controls
   */
  private removeLocationControls() {
    if (this.editorForm.get('province')) {
      this.editorForm.removeControl('province');
    }
    if (this.editorForm.get('canton')) {
      this.editorForm.removeControl('canton');
      this.cantonsArray = [];
    }
    if (this.editorForm.get('distric')) {
      this.editorForm.removeControl('distric');
      this.districsArray = [];
    }
  }

  /**
   * Adds the controls necessary to get the organization region
   */
  private addLocationControls() {
    if (!this.editorForm.get('province')) {
      this.editorForm.addControl('province', new FormControl('', Validators.required));
      this.loadProvinces();
    }
    if (!this.editorForm.get('canton')) {
      this.editorForm.addControl('canton', new FormControl('', Validators.required));
    }
    if (!this.editorForm.get('distric')) {
      this.editorForm.addControl('distric', new FormControl('', Validators.required));
    }
  }

  /**
   * Get the cantons of the province selected
   * (temporary, this first version will only work with a unique province)
   * @param idProvince
   */
  public provinceSelected(idProvince) {
    this.organizationService
      .getModelListFiltered('Cantons', {
        where: {
          provinceid: idProvince
        }
      })
      .subscribe((response) => {
        this.cantonsArray = response;
        this.selectedCanton = 0;
        this.selectedDistrict = 0;
      });
  }

  /**
   * Get the districs of the canton selected
   * (temporary, this first version will only work with a unique canton and districs)
   * @param idProvince
   */
  public cantonSelected(idCanton) {
    this.organizationService
      .getModelListFiltered('Districts', {
        where: {
          cantonid: idCanton
        }
      })
      .subscribe((response) => {
        this.districsArray = response;
        this.selectedDistrict = 0;
      });
  }

  /**
   * Validates based on the type or file selected and downloads the corresponding one
   * (Temporary solution since the first version of sicid "mejoras" its only frontend)
   */
  public generateReports(credencials) {
    this.validProvince = true;
    this.validCanton = true;
    this.validDistric = true;
    let errorCount = 0;

    if (this.organization) {
      this.getOrganizationFile(credencials.filter);
    }
    if (this.views) {
      this.getOrganizationsViews(credencials.viewsFilter);
    }
    if (this.location) {
      if (this.editorForm.valid) {
        this.getLocationFile(credencials);
      } else {
        errorCount = this.validateLocationControls();
        this.notificationService.alertThis(
          `Campos requeridos incompletos: ${errorCount}`,
          'error',
          () => {}
        );
      }
    }
  }

  /**
   * Gets the corresponding report of orgs based on their location
   * @param credencials
   */
  private getLocationFile(credencials) {
    this.organizationService
      .getOrganizationLocationReport(credencials.province, credencials.canton, credencials.distric)
      .then((response) => {
        if (response !== 'empty') {
          this.showFile(`${response}.xlsx`);
        } else {
          this.notificationService.alertThis(
            `No se han encontrado organizaciones`,
            'error',
            () => {}
          );
        }
      });
  }

  /**
   * Validates the filter and returns a correspondent file
   * @param filter
   */
  private getOrganizationFile(filter) {
    if (filter === '') {
      filter = 4;
    }
    this.organizationService.getOrganizationStatusReport(filter).then((response) => {
      if (response !== 'empty') {
        this.showFile(`${response}.xlsx`);
      } else {
        this.notificationService.alertThis(
          `No se han encontrado organizaciones`,
          'error',
          () => {}
        );
      }
    });
  }

  /**
   * Returns the views report for organizations
   * @param filter
   */
  private getOrganizationsViews(viewsfilter) {
    if (viewsfilter === '') {
      viewsfilter = 4;
    }
    this.organizationService.getOrganizationViewsReport(viewsfilter).then((response) => {
      if (response !== 'empty') {
        this.showFile(`${response}.xlsx`);
      } else {
        this.notificationService.alertThis(
          `No se han encontrado organizaciones`,
          'error',
          () => {}
        );
      }
    });
  }

  /**
   * Downloads a file and then opens a window with it
   * @param fileName
   */
  private showFile(fileName) {
    const pdfSrc = this.organizationService.getFile('reports', fileName);
    window.open(pdfSrc, '_blank');
  }

  /**
   * Validates if the credencials of the location option are valid
   */
  private validateLocationControls() {
    let countError = 0;
    if (this.editorForm.controls.province.errors) {
      this.validProvince = false;
      countError++;
    }
    if (this.editorForm.controls.canton.errors) {
      this.validCanton = false;
      countError++;
    }
    if (this.editorForm.controls.distric.errors) {
      this.validDistric = false;
      countError++;
    }
    return countError;
  }
}
