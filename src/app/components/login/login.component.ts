import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../model/User';
import { first } from 'rxjs/operators';
import { AlertService } from 'ngx-alerts';
import { TitleCasePipe } from '@angular/common';

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
    private userService: UserService,
    private titlecasePipe:TitleCasePipe,
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
    var loguser: User = new User();
    loguser.forname = this.titlecasePipe.transform(this.f.forname_input.value);
    loguser.password = this.f.password_input.value;


    this.loading = true;

    this.userService.Login(loguser)
      .pipe(first())
      .subscribe(
        data => {
          if (data != null) {
            localStorage.setItem('Loggedin_User', JSON.stringify(data));

            var loggedinUser:User = JSON.parse(localStorage.getItem('Loggedin_User'));

            if (loggedinUser.userRole == 'BRANDMASTER'){
              console.log(loggedinUser);
              
              this.router.navigateByUrl('admin')
            }
            else{
              this.router.navigateByUrl('main');
            }
            
          }
          else
          {
            this.alertService.danger('Foute naam of wachtwoord');
            this.loading = false;
          }
        },
        error => {
          this.alertService.warning('Er is iets fout gegaan tijdens het inloggen');
          this.loading = false;
        });
  }

  Register()
  {
    this.router.navigateByUrl('register');
  }

  ForgotPassword()
  {
    this.router.navigateByUrl('resetpasswordrequest');
  }
}
