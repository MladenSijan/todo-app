import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { TokenStorage } from '../token.storage';

@Injectable()
export class AuthService {
  loggedIn = false;

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) { }

  attemptAuth(username: string, password: string): Observable<any> {
    const credentials = { username: username, password: password };
    return this.http.post('http://todo.digitalcube.rs/user/login', credentials);
  }

  isAuthenticated() {
    const promise = new Promise(
      (resolve) => {
        resolve(this.tokenStorage.getToken() !== null);
      }
    );
    return promise;
  }

  logout() {
    this.tokenStorage.signOut();
    this.loggedIn = false;
  }
}
