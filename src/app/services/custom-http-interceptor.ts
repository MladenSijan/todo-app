import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

import { TokenStorage } from '../token.storage';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorage, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq;

    if (this.token.getToken() != null) {
      // Clone the request to add the new header.
      authReq = req
        .clone({
          headers: req.headers.set('Authorization', this.token.getToken())
        });
    } else {
      authReq = req.clone();
    }
    // send the newly created request
    return next.handle(authReq)
      .catch((error, caught) => {
        // intercept the response error and displace it to the console
        // return the error to the method that called it
        // this.router.navigate(['/']);
        return Observable.throw(error);
      }) as any;
  }
}
