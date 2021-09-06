import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { CoreConstants } from "../../../core/core.constants";

import { UserService } from "../user.service";
import { UserDetailComponent } from "../user-detail/user-detail.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-user-inspect",
  templateUrl: "./user-inspect.component.html",
  styleUrls: ["./user-inspect.component.scss"],
  providers: [UserService]
})
class UserInspectComponent implements OnInit {
  public descriptionReject: string;
  public userId: number;
  public userAdminId: number;
  public titleModalConfirmation: string;
  public bodyModalConfirmation: string;
  public isAcceptingUser: boolean;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private router: Router
  ) {
    this.descriptionReject = "";
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.userId = +params.userIdPk;
    });
    this._route.params.subscribe(params => {
      this.userAdminId = +params.userAdmiIdPk;
    });
  }

  acceptUser() {
    this.isAcceptingUser = true;
    this.titleModalConfirmation = "¿Aceptar?";
    this.bodyModalConfirmation =
      "¿Desea aprobar el usuario como Editor Catálogo?";
  }

  rejectUser() {
    this.isAcceptingUser = false;
    this.titleModalConfirmation = "¿Rechazar?";
    this.bodyModalConfirmation =
      "¿Desea rechazar el usuario como Editor Catálogo?";
    if (this.descriptionReject == "") {
      this.descriptionReject = "Usuario rechazado por el administrador";
    }
  }

  executeInspection(event: any) {
    const roleUser = +localStorage.getItem("rolId");
    const roleEditor =
      roleUser === CoreConstants.roleONGAdministrator
        ? CoreConstants.rolEditorONG
        : CoreConstants.rolEditorCatalog;
    if (this.isAcceptingUser) {
      this._userService.postUserInspection(
        this.userId,
        roleEditor,
        this.userAdminId,
        null
      );
    } else {
      this._userService.postUserInspection(
        this.userId,
        roleEditor,
        this.userAdminId,
        this.descriptionReject
      );
    }
    this.router.navigate(["catalog/page-dashboard/users/pending-users"]);
  }

  deleteUser() {
    this._userService.postDeleteUser(this.userId, this.userAdminId);
  }
}
export { UserInspectComponent };
