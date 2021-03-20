import {Routes} from '@angular/router';
import {StartComponent} from "../components/start/start.component";
import {MainPComponent} from "../components/mainP/mainP.component";
import {AuthGuard} from "./guard";

export const routes: Routes = [
  {path: '~s284691/dist/ClientPart/start', component: StartComponent},
  {path: '~s284691/dist/ClientPart', redirectTo: '/~s284691/dist/ClientPart/main', pathMatch: 'full'},
  {path: '~s284691/dist/ClientPart/main', component: MainPComponent, canActivate: [AuthGuard]},
  // {path: '~s284691/dist/ClientPart/main', component: MainPComponent},
  {path: '**', redirectTo: '/~s284691/dist/ClientPart/main', canActivate: [AuthGuard]}
];
