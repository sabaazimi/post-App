import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGaurd implements CanActivate{
  
    path: import("@angular/router").ActivatedRouteSnapshot[];
    route: import("@angular/router").ActivatedRouteSnapshot;

    constructor(private authService: AuthService, private router: Router){}
   
    canActivate(route: ActivatedRouteSnapshot , state: RouterStateSnapshot ): boolean | Observable<boolean> | Promise<Boolean> {

        const isAuth = this.authService.isAuth();
        if (!isAuth)
            this.router.navigate(['/login']);
        return isAuth;    
    }

}