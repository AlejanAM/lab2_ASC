import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as jsPDF from 'jspdf';

import {ItemShowModalComponent} from '../../modal/item-show-modal.component';

import {Location} from '@angular/common';
import {ItemService} from '../../item.service';
import {ProductService} from '../product.service';
import {CoreConstants} from '../../../../../core/core.constants';
import {SharedService} from '../../../../../shared/shared.service';
import {OrganizationService} from '../../../../organizations/organization.service';
import {BreadcrumbService} from '../../../../../shared/breadcrumb.service';

@Component({
  selector: 'app-product-show',
  templateUrl: './product-show.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./product-show.component.scss', '../../../../common/styles/style.scss'],
  providers: [ProductService, OrganizationService]
})
class ProductShowComponent implements OnInit {
  public href: string;
  public productDetail: any;
  public userId: number;
  public roleId: number;
  public modalId: number;
  public imgSrc: string;
  public isOpen: boolean;
  public organizationName: string;
  public viewSelected: string;
  private organizationId: number;
  private breadCrumbData: any;
  public spareParts: string;
  public slides: any;
  public itemViews: any;

  constructor(
    public itemService: ItemService,
    public sharedService: SharedService,
    private productService: ProductService,
    private organizationService: OrganizationService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
    this.href = CoreConstants.SICID_PATH_URL + this.router.url;
    this.isOpen = SharedService.isOpen;
    this.productDetail = {};
    this.breadCrumbData = sharedService.getBreadCrumb();
    this.roleId = CoreConstants.rolConsultant;
    this.userId = 0;
    this.viewSelected = 'principal-page-consultant';
    this.spareParts = '';
    this.slides = [];
    this.itemViews = 0;
  }

  ngOnInit() {
    this.loadOnInitProperties();
  }

  loadOnInitProperties() {
    this.productService
      .getProduct(this.initProperties())
      .then(this.handleShowProduct.bind(this))
      .then(this.handleProductOrganizationDetail.bind(this))
      .then(this.handleOrganizationDetail.bind(this));
  }

  /**
   * Initializes variables using url parameters
   */
  private initProperties() {
    this.roleId = +localStorage.getItem('rolId');
    let item = this.route.snapshot.params.itemIdPk
      ? this.route.snapshot.params.itemIdPk
      : this.route.snapshot.params.item;
    if (this.route.snapshot.params.organizationId) {
      this.organizationId = this.route.snapshot.params.organizationId;
    }
    if (this.route.snapshot.params.userIdPk) {
      this.userId = this.route.snapshot.params.userIdPk;
    }
    return item;
  }

  /**
   * Handles the product data
   * @param response
   */
  handleShowProduct(response: any) {
    this.productDetail = response.product;
    this.addBreadCrumb();
    this.productDetail.item.daysToOperations = this.itemService.cleanDaysOperationObj(
      this.productDetail.item.daysToOperations
    );
    this.organizationId = response.product.item.organizationsIdFk;
    this.getSpareParts(this.productDetail);
    this.handleImagesSlider();
    this.handleFilesSlider();
    if (this.sharedService.isConsultantView(this.viewSelected)) {
      this.itemViews = this.productDetail.item.itemViews + 1;
      this.productService.putProductViews(this.productDetail.item.idPk, this.itemViews).then();
    }

    return Promise.resolve();
  }

  /**
   * Add the routes for the breadcrumb array based on the type of view
   */
  addBreadCrumb() {
    this.breadcrumbService.addBreadCrumb({
      page: this.productDetail.item.name,
      href: `/#${this.route.snapshot['_routerState'].url}`
    });
  }

  getSpareParts(response) {
    if (response.product) {
      if (response.product.spareParts) {
        response.product.spareParts.forEach((sparePart) => {
          if (Object.keys(sparePart).length > 0) {
            this.spareParts += ' ' + sparePart.sparePart + ',';
          } else {
            this.spareParts = 'No';
          }
        });
      }
    }
  }

  /**
   * Validates if the product has images and then adds them into the slides array
   */
  handleImagesSlider() {
    if (this.productDetail.item.image1 !== '') {
      this.slides.push({
        src: this.productDetail.item.image1,
        type: 'image',
        alt: this.productDetail.item.image1Name
      });
    }
    if (this.productDetail.item.image2 !== '') {
      this.slides.push({
        src: this.productDetail.item.image2,
        type: 'image',
        alt: this.productDetail.item.image2Name
      });
    }
    if (this.productDetail.item.image3 !== '') {
      this.slides.push({
        src: this.productDetail.item.image3,
        type: 'image',
        alt: this.productDetail.item.image3Name
      });
    }
  }

  /**
   * Validates if the product has files and then adds them to the slides array
   */
  handleFilesSlider() {
    if (this.productDetail.item.itemFile1 !== '' && this.productDetail.item.itemFile1 !== null) {
      this.slides.push({
        src: this.productDetail.item.itemFile1,
        type: 'file',
        file: this.productDetail.item.itemFile1
      });
    }
    if (this.productDetail.item.itemFile2 !== '' && this.productDetail.item.itemFile1 !== null) {
      this.slides.push({
        src: this.productDetail.item.itemFile2,
        type: 'file',
        file: this.productDetail.item.itemFile2
      });
    }
    if (this.productDetail.item.itemFile3 !== '' && this.productDetail.item.itemFile1 !== null) {
      this.slides.push({
        src: this.productDetail.item.itemFile3,
        type: 'file',
        file: this.productDetail.item.itemFile3
      });
    }
  }

  handleProductOrganizationDetail() {
    const organizationId = this.organizationId;
    return this.organizationService.getOrganizationDetail(organizationId);
  }

  handleOrganizationDetail(response) {
    this.organizationName = response.organization.details.name;
  }

  /**
   * Redirects to the update product view
   * @param itemId
   */
  editProduct(itemId: number) {
    this.router.navigate(['update-product', itemId, this.organizationId, this.userId], {
      relativeTo: this.route.parent
    });
  }

  /**
   * Downloads a product and then opens a window with it
   * @param fileName
   */
  showFile(fileName) {
    let pdfSrc = this.productService.getFile('productFiles', fileName);
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
    if (this.roleId !== CoreConstants.rolConsultant && this.roleId !== 0) {
      this.router.navigate(['item-list'], {
        relativeTo: this.route.parent.parent
      });
    } else {
      this.router.navigate(['/principal-page-consultant']);
    }
  }

  downloadPDF() {
    // the html element to become a pdf
    const titleImagesPartPdf = document.getElementById('titleImagesPartPdf'); // tslint: disable-line
    const firstPartPdf = document.getElementById('firstPartPdf'); // tslint: disable-line
    const secondPartPdf = document.getElementById('secondPartPdf'); // tslint: disable-line
    const pdf = new jsPDF('p', 'pt', 'a4');
    let options = {
      format: 'PNG'
    };
    pdf.addHTML(titleImagesPartPdf, 10, 10, options, () => {
      pdf.addHTML(firstPartPdf, 10, 250, options, () => {
        pdf.addPage();
        pdf.addHTML(secondPartPdf, 10, 10, options, () => {
          pdf.save(`${this.productDetail.item.name}.pdf`);
        });
      });
    });
  }
}
export {ProductShowComponent};
