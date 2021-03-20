import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    console.log("can activate");
    let isToken: boolean = this.authService.isTokenExpired();
    console.log(isToken);
    if (isToken)
      return true;
    else {
      this.router.navigateByUrl("/~s284691/dist/ClientPart/start");
      return false;
    }
  }

}
