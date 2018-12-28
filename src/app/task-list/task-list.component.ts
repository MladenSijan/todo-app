import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { TasksService } from '../tasks.service';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isDoneList;
  @Input() checkedTask;
  newTask;
  subscription: Subscription;
  @Output() taskChecked = new EventEmitter();
  isListHidden = false;
  tasks = new Array;
  taskList = [];

  constructor(
    private tasksService: TasksService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getTasks();
    this.subscription = this.tasksService.newTaskCreated$.subscribe(newTask => {
      if (!this.isDoneList) {
        this.newTask = newTask;
        this.addNewTask(this.newTask);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isDoneList && !changes['checkedTask']['firstChange']) {
      this.tasks.push(changes['checkedTask']['currentValue']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkTask(task) {
    task['done'] = true;
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);

    this.tasksService.update(task).subscribe(
      () => {
        this.taskChecked.emit(task);
      },
      (error) => {
        this.tasks.splice(index, 0, task);

        this.snackBar.open('Error occured. Please, try again', null, {
          duration: 2000,
        });
        throw error;
      }
    );
  }

  deleteTask(task) {
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);

    this.tasksService.delete(task['id'])
      .subscribe(
        () => {
          this.snackBar.open('Task successfully deleted', null, {
            duration: 2000,
          });
        },
        (error) => {
          this.tasks.splice(index, 0, task);

          this.snackBar.open('Error occured. Please, try again', null, {
            duration: 2000,
          });
          throw error;
        }
      );
  }

  addNewTask(taskContent) {
    this.tasksService.create({ content: taskContent })
      .subscribe(
        () => {
          this.getTasks();

          this.snackBar.open('Task added', null, {
            duration: 2000,
          });
        },
        (error) => {
          throw error;
        }
      );
  }

  getTasks() {
    this.tasksService.getAll()
      .subscribe(
        (taskList) => {
          if (this.isDoneList) {
            this.taskList = taskList['todos'];
            this.tasks = this.taskList.filter(task => task['done']);
          } else {
            this.taskList = taskList['todos'];
            this.tasks = this.taskList.filter(task => !task['done']);
          }
        },
        (error) => {
          this.snackBar.open('Error occured. Please, try again', null, {
            duration: 2000,
          });
          throw error;
        }
      );
  }
}
