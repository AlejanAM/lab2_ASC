import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as jsPDF from 'jspdf';

import {Location} from '@angular/common';
import {ItemService} from '../../item.service';
import {ServiceService} from '../service.service';
import {CoreConstants} from '../../../../../core/core.constants';
import {SharedService} from '../../../../../shared/shared.service';
import {OrganizationService} from '../../../../organizations/organization.service';
import {ProductService} from '../../product/product.service';
import {BreadcrumbService} from '../../../../../shared/breadcrumb.service';

@Component({
  selector: 'app-service-show',
  templateUrl: './service-show.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./service-show.component.scss', '../../../../common/styles/style.scss'],
  providers: [ServiceService, OrganizationService, ProductService]
})
class ServiceShowComponent implements OnInit {
  public href: string;
  public serviceDetail: any;
  public userId: number;
  public roleId: number;
  public modalId: number;
  public imgSrc: string;
  public viewSelected: string;
  public isOpen: boolean;
  public organizationName: string;
  private organizationId: number;
  private breadCrumbData: any;
  public slides: any;
  public itemViews: any;

  constructor(
    public itemService: ItemService,
    public sharedService: SharedService,
    private serviceService: ServiceService,
    private productService: ProductService,
    private location: Location,
    private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
    this.href = CoreConstants.ANGULAR_PATH_URL + this.router.url;
    this.isOpen = SharedService.isOpen;
    this.serviceDetail = {};
    this.breadCrumbData = sharedService.getBreadCrumb();
    this.roleId = CoreConstants.rolConsultant;
    this.userId = 0;
    this.viewSelected = 'principal-page-consultant';
    this.slides = [];
    this.itemViews = 0;
  }

  ngOnInit() {
    this.loadOnInitProperties();
  }

  /**
   * Initializes all necessary variables for the service to show
   */
  loadOnInitProperties() {
    this.roleId = Number(localStorage.getItem('rolId'));
    let item = this.route.snapshot.params.itemIdPk
      ? this.route.snapshot.params.itemIdPk
      : this.route.snapshot.params.item;
    if (this.route.snapshot.params.organizationId) {
      this.organizationId = this.route.snapshot.params.organizationId;
    }
    if (this.route.snapshot.params.userIdPk) {
      this.userId = this.route.snapshot.params.userIdPk;
    }
    this.serviceService
      .getService(item)
      .then(this.handleShowService.bind(this))
      .then(this.handleServiceOrganizationDetail.bind(this))
      .then(this.handleOrganizationDetail.bind(this));
  }

  /**
   * handles the service data
   * @param response
   */
  handleShowService(response: any) {
    this.serviceDetail = response.service;
    this.addBreadCrumb();
    this.serviceDetail.item.service.cover = !isNaN(+this.serviceDetail.item.service.cover)
      ? +this.serviceDetail.item.service.cover
      : -1;
    this.serviceDetail.item.service.typeSupports = !isNaN(
      +this.serviceDetail.item.service.typeSupports
    )
      ? +this.serviceDetail.item.service.typeSupports
      : -1;
    this.serviceDetail.item.daysToOperations = this.itemService.cleanDaysOperationObj(
      this.serviceDetail.item.daysToOperations
    );
    this.serviceDetail.item.service.daysToOperations = this.itemService.cleanDaysOperationObj(
      this.serviceDetail.item.service.daysToOperations
    );
    if (this.sharedService.isConsultantView(this.viewSelected)) {
      this.itemViews = this.serviceDetail.item.itemViews + 1;
      this.productService.putProductViews(this.serviceDetail.item.idPk, this.itemViews).then();
    }
    this.organizationId = response.service.item.organizationsIdFk;
    this.handleImagesSlider();

    return Promise.resolve();
  }

  /**
   * Add the routes for the breadcrumb array based on the type of view
   */
  addBreadCrumb() {
    this.breadcrumbService.addBreadCrumb({
      page: this.serviceDetail.item.name,
      href: `/#${this.route.snapshot['_routerState'].url}`
    });
  }

  /**
   * Validates if the product has images and then adds them into the slides array
   */
  handleImagesSlider() {
    if (this.serviceDetail.item.image1 !== '') {
      this.slides.push({src: this.serviceDetail.item.image1});
    }
    if (this.serviceDetail.item.image2 !== '') {
      this.slides.push({src: this.serviceDetail.item.image2});
    }
    if (this.serviceDetail.item.image3 !== '') {
      this.slides.push({src: this.serviceDetail.item.image3});
    }
  }

  handleServiceOrganizationDetail() {
    const organizationId = this.organizationId;
    return this.organizationService.getOrganizationDetail(organizationId);
  }

  handleOrganizationDetail(response) {
    this.organizationName = response.organization.details.name;
  }

  /**
   * Redirects to the update service view
   * @param itemId
   */
  editService(itemId: number) {
    this.router.navigate(['update-service', itemId, this.organizationId, this.userId], {
      relativeTo: this.route.parent
    });
  }

  /**
   * Downloads a service and then opens a window with it
   * @param fileName
   */
  showFile(fileName) {
    let pdfSrc = this.productService.getFile('servicesFiles', fileName);
    window.open(pdfSrc, '_blank');
  }

  showModal(modalId: string, image: string) {
    SharedService.isOpen = true;
    SharedService.imgSrc = image;
    SharedService.modalId = modalId;
    this.isOpen = SharedService.isOpen;
  }

  handleChangeModalState(event: any) {
    this.isOpen = event;
  }

  backToConsultantView() {
    if (this.roleId != CoreConstants.rolConsultant && this.roleId != 0) {
      this.router.navigate(['item-list'], {
        relativeTo: this.route.parent.parent
      });
    } else {
      this.router.navigate(['/principal-page-consultant']);
    }
  }

  downloadPDF() {
    const titleImagesPartPdf = document.getElementById('titleImagesPartPdf');
    const firstPartPdf = document.getElementById('firstPartPdf');
    const secondPartPdf = document.getElementById('secondPartPdf');
    const pdf = new jsPDF('p', 'pt', 'a4');
    let options = {
      format: 'PNG'
    };
    pdf.addHTML(titleImagesPartPdf, 10, 10, options, () => {
      pdf.addHTML(firstPartPdf, 10, 250, options, () => {
        pdf.addPage();
        pdf.addHTML(secondPartPdf, 10, 10, options, () => {
          pdf.save(`${this.serviceDetail.item.name}.pdf`);
        });
      });
    });
  }
}
export {ServiceShowComponent};
