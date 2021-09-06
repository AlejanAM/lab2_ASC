import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-no-approved',
  templateUrl: './organization.component.html',
  styleUrls: ['../../../common/styles/style.scss']
})
class OrganizationComponent {
  @Input() organization: {
    dPk: number,
    name: string,
    dni: string,
    email: string,
    web: string
  };

  constructor(public _route: Router) { }
}
export { OrganizationComponent }
