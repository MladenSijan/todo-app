import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { TokenStorage } from '../token.storage';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  checkedTask = {};
  isToggleVisible = false;
  toggleValue = 'notDone';

  newTaskForm: FormGroup;
  newTask;
  @ViewChild('group') toggle: MatButtonToggleGroup;

  constructor(
    private tokenStorage: TokenStorage,
     private router: Router,
     private tasksService: TasksService) { }

  ngOnInit() {
    this.checkWidth();

    this.newTaskForm = new FormGroup({
      newTask: new FormControl()
    });
  }

  getCheckedTask(task) {
    this.checkedTask = task;
  }

  sendContent(event) {
    console.log('okay');
    this.tasksService.sendNewTask(this.newTask);
    this.newTaskForm.reset();
    this.toggle.value = this.toggleValue;
  }

  checkWidth() {
    if (window.innerWidth < 680) {
      this.isToggleVisible = true;
    } else {
      this.isToggleVisible = false;
    }
  }

  logout() {
    this.tokenStorage.signOut();
    this.router.navigate(['/']);
  }
}
