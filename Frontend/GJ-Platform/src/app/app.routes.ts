import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GlobalCRUDsComponent } from './global-cruds/global-cruds.component';
import { GameInformationComponent } from './game-information/game-information.component';
import { GlobalSiteInformationComponent } from './global-site-information/global-site-information.component';
import { GlobalSitesComponent } from './global-sites/global-sites.component';
import { LocalSiteInformationComponent } from './local-site-information/local-site-information.component';

export const routes: Routes = [
    {path: '',redirectTo: "login", pathMatch: "full"},

    {path: 'login',component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'DataManagement', component: GlobalCRUDsComponent},
    {path: 'Sites', component: GlobalSitesComponent},
    {path: 'Sites/:region', component: GlobalSitesComponent},
    {path: 'Sites/:region/Information/:site', component: GlobalSiteInformationComponent},
    {path: 'Games', component: LocalSiteInformationComponent},
    {path: 'Games/:game/Information', component: GameInformationComponent}
];
