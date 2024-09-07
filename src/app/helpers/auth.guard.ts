import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

      const user = this.authService.currentUserValue;

      if (user){
        // is route restricted by role?
        if (route.data.roles && !route.data.roles.includes(user.role)){
          // route is note authorized, return to home
          this.router.navigate(['/']);
          return false;
        }
          // user is authorized
        if  (user.role == "User" && route.url[0].path == "graphics") this.router.navigate(['dash/inventory']);

        return true;
      }

    // user not logged in, go to login
    this.router.navigate(['/login/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
