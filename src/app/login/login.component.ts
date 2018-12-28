import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorage } from '../token.storage';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username;
  password;
  loginForm: FormGroup;
  hide = true;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorage,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.tokenStorage.getToken() !== null) {
      this.router.navigate(['tasks']);
    }

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  login() {
    this.authService.attemptAuth(this.loginForm.get('username').value, this.loginForm.get('password').value)
      .subscribe(
        data => {
          this.tokenStorage.saveToken(data['token']);
          this.router.navigate(['tasks']);
        }, error => {
          this.snackbar.open('Login failed. Enter valid credentials.', null, {
            duration: 2000,
          });
          throw error;
        }
      );
  }

}
