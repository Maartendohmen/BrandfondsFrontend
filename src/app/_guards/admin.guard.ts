import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { User } from '../model/User';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        var jwtoken: string = JSON.parse(localStorage.getItem('jwt_token'));
        var user: User = JSON.parse(localStorage.getItem('current_user'));

        if (jwtoken != undefined) {

            if (user.userRole == "BRANDMASTER") {
                return true;
            }
        }


        // not logged in so redirect to login page with the return url
        this.router.navigate([''], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
