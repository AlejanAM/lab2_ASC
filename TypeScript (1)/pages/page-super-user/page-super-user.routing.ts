import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PrincipalPageSuperUserComponent } from "./page-super-user.component";
import { PageSubSystemsComponent } from "./view-list-users/page-subsystems/page-subsystems.component";
import { PageViewListUserComponent } from "./view-list-users/view-list-users.component";
import { PageListUserComponent } from "./view-list-users/list-users/list-users.component";
import { ProfileComponent } from "../../profile/profile.component";
import { ProfileUpdateComponent } from "../../profile/update/profile-update.component";
import { LegalRepresentativeOrganizationComponent } from "./legal-representative-organization/legal-representative-organization.component";
import { ListOrganizationByUserComponent } from "./list-organization/list-organization.component";
import { NewOrganizationComponent } from "./new-organization/new-organization.component";
import { CreateReportComponent } from "./create-report/create-report.component";

const routes: Routes = [
  {
    path: "",
    component: PrincipalPageSuperUserComponent,
    data: { breadCrumb: "" },
    children: [
      {
        path: "view-list-users",
        component: PageViewListUserComponent,
        data: { breadCrumb: "Ver Usuarios" },
        children: [
          {
            path: "",
            component: PageSubSystemsComponent,
            data: { breadCrumb: "Subsistemas" },
          },
          {
            path: "page-subsystems",
            component: PageSubSystemsComponent,
            data: { breadCrumb: "Subsistemas" },
          },
          {
            path: "page-list-user",
            component: PageListUserComponent,
            data: { breadCrumb: "Lista de usuarios" },
          },
          {
            path: "profile-info/:userToEditIdPk",
            component: ProfileComponent,
            data: { breadCrumb: "Información de usuario" },
          },
          {
            path: "user-update/:userId/:roleId",
            component: ProfileUpdateComponent,
            data: { breadCrumb: "Actualizar información de usuario" },
          },
        ],
      },
      {
        path: "create-user",
        loadChildren:
          "app/home/user-create/user-create.module#UserCreateModule",
        data: { breadCrumb: "" },
      },
      {
        path: "legal-representative",
        component: LegalRepresentativeOrganizationComponent,
        data: { breadCrumb: "Representantes legales" },
      },
      {
        path: "list-organization-by-user",
        component: ListOrganizationByUserComponent,
        data: { breadCrumb: "Organizaciones por usuario" },
      },
      {
        path: "new-organization",
        component: NewOrganizationComponent,
        data: { breadCrumb: "Crear Organización" },
      },
      {
        path: "create-report",
        component: CreateReportComponent,
        data: { breadCrumb: "Crear Reporte" },
      },
    ],
  },
];

export const SuperUserRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes
);
export const routedComponents = [
  PageListUserComponent,
  PrincipalPageSuperUserComponent,
  PageViewListUserComponent,
  PageSubSystemsComponent,
  LegalRepresentativeOrganizationComponent,
  ListOrganizationByUserComponent,
  NewOrganizationComponent,
];
