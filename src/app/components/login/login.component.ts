import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../model/User';
import { first } from 'rxjs/operators';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loguser: User;
  public loginForm: FormGroup;

  error = '';
  submitted = false;
  loading = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService) { }

  LogIn(e) {
    this.router.navigateByUrl('main');
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username_input: ['', Validators.required],
      password_input: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loguser = new User();
    this.loguser.username = this.f.username_input.value;
    this.loguser.password = this.f.password_input.value;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService.Login(this.loguser)
      .pipe(first())
      .subscribe(
        data => {
          if (data != null) {
            localStorage.setItem('Loggedin_User', JSON.stringify(data));
            this.router.navigateByUrl('main');
          }
          else
          {
            this.alertService.warning('Er is iets fout gegaan met inloggen')
          }
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
