import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from './user/user.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'catalog',
  templateUrl: './catalog.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './catalog.component.scss',
    './common/styles/style.scss'
  ],
  providers: [UserService]
})
class CatalogComponent implements AfterViewChecked, OnInit {

  public roleId: number;
  public userId: number;
  public user: any;
  public show: boolean;
  public showNavbar: boolean;
  public isConsultantPage: boolean;
  public fontSize: number;

  constructor(
    public userService: UserService,
    private sharedService: SharedService,
    private ref: ChangeDetectorRef,
    private route: Router,
    private routeActivated: ActivatedRoute,
  ) {
    this.show = false;
    this.showNavbar = false;
  }

  ngOnInit() {
    this.roleId = +localStorage.getItem('rolId');
    this.userId = +localStorage.getItem('userId');
    this.userService.getUserDetail(this.userId)
      .then(this.handleGetUser.bind(this));

    setTimeout(() => {
      this.sharedService.setSpinnerLoading(false);
      this.show = true;
      this.showNavbar = this.sharedService.showNavBarByRoute('home');
    }, 2000);
  }


  ngAfterViewChecked() {
    this.checkUrlToShowNavBar();
    this.roleId = +localStorage.getItem('rolId');
    this.userId = +localStorage.getItem('userId');
    this.showNavbar = this.sharedService.showNavBarByRoute('home');
    this.ref.detectChanges();
  }

  private checkUrlToShowNavBar(): void {
    if (this.route.url.indexOf('principal-page-consultant') !== -1) {
      this.isConsultantPage = true;
    } else {
      this.isConsultantPage = false;
    }
  }

  public isNavBarEnable(): boolean {
    return this.showNavbar && !this.isConsultantPage;
  }

  handleGetUser(param: any) {
    this.user = param.user.details;
  }

  onFontSizeChange(size: number) {
    this.fontSize = size;
  }
}
export { CatalogComponent }
