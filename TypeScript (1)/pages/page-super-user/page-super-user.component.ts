import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  DEFAULT_MESSAGE,
  DEFAULT_TITLE,
  ENT_STATE_MESSAGE,
} from '../pages.constants';

import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-principal-page-super-user',
  templateUrl: './page-super-user.component.html',
  styleUrls: [
    './page-super-user.component.scss',
    '../../common/styles/style.scss'
  ]
})
class PrincipalPageSuperUserComponent implements OnInit {

  public isActive: boolean;
  public selectedFatherIndex: number;
  public selectedChildIndex: number;
  public message: string;
  public title: string;
  public orgStateMessages: string[];
  public orgStates: any;
  public isUserSelected: boolean;
  public isOrganizationSelected: boolean;
  public isDefaultActivate: boolean;
  public isReportSelected: boolean;
  public userId: number;
  public fontSize: number;

  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.isUserSelected = true;
    this.isOrganizationSelected = true;
    this.isDefaultActivate = true;
    this.isReportSelected = true;
    this.isActive = false;
    this.selectedChildIndex = 0;
    this.selectedFatherIndex = 0;
    this.message = DEFAULT_MESSAGE;
    this.title = DEFAULT_TITLE;
    this.orgStateMessages = ENT_STATE_MESSAGE;
    this.orgStates = {};
  }

  ngOnInit() {
    this.userId = +localStorage.getItem('userId');
    this.sharedService.setSuperUserProfileBehavior = false;
  }

  selectChildState(index: number) {
    this.selectedChildIndex = index;
  }

  enableHorizontalElements(element: number) {
    this.selectedFatherIndex = element;
    this.isUserSelected = true;
    this.isOrganizationSelected = true;
    this.isReportSelected = true;
    switch (element) {
      case 1:
        this.isUserSelected = !this.isUserSelected;
      break;
      case 2:
        this.isOrganizationSelected = !this.isOrganizationSelected;
      break;
      case 3:
        this.isReportSelected = !this.isReportSelected;
      break;
      default:
        break;
    }
  }

  onFontSizeChange(size: number) {
    this.fontSize = size;
  }

}
export { PrincipalPageSuperUserComponent }
