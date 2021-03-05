import {Routes} from '@angular/router';
import {StartComponent} from "../components/start/start.component";
import {MainPComponent} from "../components/mainP/mainP.component";
import {AuthGuard} from "./guard";

export const routes: Routes = [
  {path: 'start', component: StartComponent},
  {path: '', redirectTo: '/start', pathMatch: 'full'},
  {path: 'main', component: MainPComponent, canActivate: [AuthGuard]},
  {path: 'main', component: MainPComponent},
  {path: '**', redirectTo: '/main', canActivate: [AuthGuard]}
];
