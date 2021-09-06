import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {PageSuperUserService} from '../page-super-user.service';
import {ModalUserOrganization} from './modal-user-organizations/modal-user-organization.service';
import {ConfirmationModalService} from './confirmation-modal/confirmation-modal.service';
import {BreadcrumbService} from '../../../../shared/breadcrumb.service';

@Component({
  selector: 'app-list-organization',
  templateUrl: './list-organization.component.html',
  styleUrls: ['./list-organization.component.scss'],
  providers: [PageSuperUserService, ModalUserOrganization],
})
class ListOrganizationByUserComponent implements OnInit {
  public itemBreadCrumb: any;
  public usersList: any;
  public userToSearch: string;
  public page: any;

  constructor(
    private pageSuperUserService: PageSuperUserService,
    private userOrganizationService: ModalUserOrganization,
    private confirmationModal: ConfirmationModalService,
    private breadcrumbService: BreadcrumbService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.itemBreadCrumb = [];
    this.usersList = [];
    this.breadcrumbService.breadCrumbArray.subscribe((response) => {
      this.itemBreadCrumb = response;
    });
    this.confirmationModal.getMessage().subscribe((message) => {
      this.getAllData();
    });
  }

  ngOnInit() {
    this.getAllData();
    this.addBreadcrumb();
  }

  /**
   * Add the routes for the breadcrumb array based on the type of view
   */
  addBreadcrumb() {
    this.breadcrumbService.clearBreadCrumb();
    this.breadcrumbService.addBreadCrumb({
      page: 'Inicio',
      href: '/#/catalog/principal-page-super-user',
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Entidades',
      href: '/#/catalog/principal-page-super-user',
    });
    this.breadcrumbService.addBreadCrumb({
      page: 'Entidades por usuario',
      href: `/#${this.activatedRoute.snapshot['_routerState'].url}`,
    });
  }

  getAllData() {
    this.pageSuperUserService
      .getAllOrganizationByAllUsers()
      .then(this.handleUsers.bind(this));
  }

  handleUsers(response: any) {
    this.usersList = response;
  }

  getUserToSearch(userToSearch: string) {
    this.userToSearch = userToSearch;
  }

  openModal(user: any) {
    this.userOrganizationService.alertThis(user, 'success', () => {});
  }
}
export {ListOrganizationByUserComponent};
