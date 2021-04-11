import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router,
        private alertService: AlertService) { }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {

        const JWTTOKEN = JSON.parse(localStorage.getItem('jwt_token'));

        if (JWTTOKEN) {
            req = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + JWTTOKEN)
            });

            return next.handle(req).pipe(tap(() => { },
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status !== 401) {
                            return;
                        }
                        this.router.navigate(['']);
                        this.alertService.danger("Je inlog sessie is verlopen, log opnieuw in")
                    }
                }));
        }
        else {
            return next.handle(req);
        }
    }
}
