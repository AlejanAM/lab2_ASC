import { throwError as observableThrowError, Observable } from "rxjs";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { OrganizationService } from "../organization.service";
import { BreadcrumbService } from "../../../shared/breadcrumb.service";

@Component({
  selector: "app-organization-details",
  templateUrl: "./organization-detail.component.html",
  styleUrls: [
    "./organization-detail.component.scss",
    "../../common/styles/style.scss",
  ],
  providers: [OrganizationService],
})
class OrganizationsDetailComponent implements OnInit {
  public organizationDetail: any;
  public idOrganization: number;
  public regionsBuilt: any;

  constructor(
    private _organizationService: OrganizationService,
    private _route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.organizationDetail = {};
    this.regionsBuilt = {};
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.idOrganization = +params.organizationIdPk;
    });
    this._organizationService
      .getOrganizationDetail(this.idOrganization)
      .then(this.handleOrganizationDetail.bind(this))
      .then(this.handleOrganizationType.bind(this))
      .catch((err) => observableThrowError(true));
  }

  /**
   * Adds the breadcrumb of this view
   * @param organization
   */
  addBreadCrumb(organization) {
    this.breadcrumbService.addBreadCrumb({
      page: organization,
      href: `/#${this._route.snapshot["_routerState"].url}`,
    });
  }

  handleOrganizationType(organizationTypeId: any) {
    this._organizationService
      .getOrganizationsType(organizationTypeId)
      .then((organizationType: any) => {
        this.organizationDetail.organizationType = organizationType;
      });
  }

  handleOrganizationDetail(response: any) {
    this.organizationDetail = response.organization.details;
    this.addBreadCrumb(this.organizationDetail.name);
    this.organizationDetail.addresses = response.organization.address;
    this.buidOperationDays(this.organizationDetail.dayOperations);
    this.buildSocialNetworks(response.organization.details.socialNetworks);
    this.loadRegionLocalizations(response.organization.regions);
    return Promise.resolve(
      response.organization.details.organizationsTypesidPk
    );
  }

  loadRegionLocalizations(regions: any) {
    let buildRegions = {
      provinces: [],
      cantons: [],
      districts: [],
    };
    let buildLocalizations = this._organizationService.buildRegionLocalization(
      regions
    );
    this.loadLocalization(buildLocalizations, regions, buildRegions);
  }

  loadLocalization(localizations: any, regions: any, buildRegions: any) {
    localizations.provinces.map((localization, index) => {
      this._organizationService
        .getProvinces()
        .then((provinces) => {
          provinces.map((province) => {
            if (Number(localization) === province.id) {
              let newProvince = {
                id: province.id,
                name: province.name,
              };
              buildRegions.provinces.push(newProvince);
            }
          });
          return Promise.resolve(buildRegions);
        })
        .then((regions) => {
          this._organizationService
            .getCantons(regions.provinces[index].id)
            .then((cantons) => {
              cantons.map((canton) => {
                if (Number(localizations.cantons[index]) === canton.id) {
                  let newCanton = {
                    id: canton.id,
                    name: canton.name,
                  };
                  regions.cantons.push(newCanton);
                }
              });
              return Promise.resolve(regions);
            })
            .then((regions) => {
              this._organizationService
                .getDistricts(regions.cantons[index].id)
                .then((districts) => {
                  districts.map((district) => {
                    if (
                      Number(localizations.districts[index]) === district.id
                    ) {
                      let newDistrict = {
                        id: district.id,
                        name: district.name,
                      };
                      regions.districts.push(newDistrict);
                    }
                  });
                  return Promise.resolve(regions);
                });
            });
        });
    });

    this.regionsBuilt = buildRegions;
  }

  buidOperationDays(schedule: any) {
    schedule.map((operationDay) => {
      if (operationDay.day === "monday" && operationDay.available) {
        operationDay.day = "Lunes";
      } else if (operationDay.day === "tuesday" && operationDay.available) {
        operationDay.day = "Martes";
      } else if (operationDay.day === "wednesday" && operationDay.available) {
        operationDay.day = "Miércoles";
      } else if (operationDay.day === "thursday" && operationDay.available) {
        operationDay.day = "Jueves";
      } else if (operationDay.day === "friday" && operationDay.available) {
        operationDay.day = "Viernes";
      } else if (operationDay.day === "saturday" && operationDay.available) {
        operationDay.day = "Sábado";
      } else if (operationDay.day === "sunday" && operationDay.available) {
        operationDay.day = "Domingo";
      }
    });
  }

  buildSocialNetworks(socialNetworks: any) {
    let buildSocialNetworks = [];
    socialNetworks.map((socialNetwork) => {
      let key = Object.keys(socialNetwork)[0];
      if (key === "facebook") {
        this.organizationDetail.socialNetworksFacebook = socialNetwork[key];
      } else if (key === "twitter") {
        this.organizationDetail.socialNetworksTwitter = socialNetwork[key];
      } else if (key === "instagram") {
        this.organizationDetail.socialNetworksInstagram = socialNetwork[key];
      } else if (key === "whatsapp") {
        this.organizationDetail.socialNetworksWhatsapp = socialNetwork[key];
      }
    });
  }
}
export { OrganizationsDetailComponent };
