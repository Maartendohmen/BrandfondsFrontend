import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenicateService } from 'src/app/services/authenicate.service';
import { User } from '../../model/User';
import { first } from 'rxjs/operators';
import { AlertService } from 'ngx-alerts';
import { TitleCasePipe } from '@angular/common';
import { AuthenticationRequest } from 'src/app/model/authentication/AuthenticationRequest';
import { AuthenticationResponse } from 'src/app/model/authentication/AuthenticationResponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  submitted = false;
  loading = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthenicateService,
    private titlecasePipe: TitleCasePipe,
    private alertService: AlertService) { }

  LogIn(e) {
    this.router.navigateByUrl('main');
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      forname_input: ['', Validators.required],
      password_input: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmitLogin() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    var username = this.titlecasePipe.transform(this.f.forname_input.value);
    var password = this.f.password_input.value;

    var authrequest: AuthenticationRequest = new AuthenticationRequest(username, password);

    this.loading = true;

    this.authService.Login(authrequest)
      .pipe(first())
      .subscribe(
        authresponse => {
          if (authresponse != null) {

            localStorage.setItem('current_user', JSON.stringify(authresponse.user));
            localStorage.setItem('jwt_token', JSON.stringify(authresponse.jwt))

            if (authresponse.user.userRole == 'BRANDMASTER') {
              this.router.navigateByUrl('admin')
            }
            else {
              this.router.navigateByUrl('main');
            }

          }
        },
        error => {

          this.alertService.danger(error.error.message);

          this.loading = false;
        });
  }

  Register() {
    this.router.navigateByUrl('register');
  }

  ForgotPassword() {
    this.router.navigateByUrl('resetpasswordrequest');
  }
}
