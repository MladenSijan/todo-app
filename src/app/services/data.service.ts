import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { NotFoundError } from '../shared/errors/not-found';
import { BadInput } from '../shared/errors/bad-input';
import { AppError } from '../shared/errors/app-error';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  constructor(protected url: string, protected http: HttpClient, private router: Router) { }

  create(resource) {
    return this.http.put(this.url, resource)
      .catch(this.handleError);
  }

  getAll() {
    return this.http.get(this.url)
      .catch(this.handleError);
  }

  update(resource) {
    return this.http.patch(this.url + '/' + resource.id, { done : true })
      .catch(this.handleError);
  }

  delete(id) {
    return this.http.delete(this.url + '/' + id)
      .catch(this.handleError);
  }

  protected handleError(error: Response) {
    switch (error.status) {
      case 404:
        return Observable.throw(new NotFoundError(error));
      case 400:
        return Observable.throw(new BadInput(error));
      default:
        break;
    }
    return Observable.throw(new AppError(error));
  }
}
