import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { DataService } from './services/data.service';

@Injectable()
export class TasksService extends DataService {
  constructor(http: HttpClient, router: Router) {
    super('http://todo.digitalcube.rs/api/todos', http, router);
  }

  private newTask = new Subject();

  newTaskCreated$ = this.newTask.asObservable();

  sendNewTask(localTypeData) {
    this.newTask.next(localTypeData);
  }
}
