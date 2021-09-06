import { NgModule } from '@angular/core';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';

import { coreModules } from '../core/core.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { PrincipalPagesModule } from './pages/pages.module';
import { ItemsModule } from './items/items.module';
import { LayoutModule } from '../layout/layout.module';
import { UtilsModule } from '../utils/utils.module';
import { CatalogRoutingModule, routedComponents } from './catalog.routing';
import { DirectivesModule } from '../directives/directives.module';

import { CoreConstants } from '../core/core.constants';
import { AuthGuardService } from '../auth/services/auth-guard.service';
import { AuthService } from '../auth/services/auth.service';
import { SharedService } from '../shared/shared.service';
import { TitleService } from '../shared/title.service';
import { PreviousRouteService } from '../shared/previous-route.service';

import { CATALOG_CONFIG, CatalogConfig } from './catalog.config';

library.add(faFacebookF);
library.add(faTwitter);

@NgModule({
  imports: [
    DirectivesModule,
    coreModules,
    CatalogRoutingModule,
    UtilsModule,
    LayoutModule,
    ProfileModule,
    ItemsModule,
    PrincipalPagesModule,
    UserModule,
  ],
  declarations: [
    routedComponents
  ],
  entryComponents: [routedComponents],
  providers: [
    CoreConstants,
    SharedService,
    AuthService,
    AuthGuardService,
    TitleService,
    PreviousRouteService,
    { provide: CATALOG_CONFIG, useValue: CatalogConfig },
  ]
})
export class CatalogModule {}
