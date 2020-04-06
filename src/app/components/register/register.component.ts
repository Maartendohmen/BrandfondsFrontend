import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/model/User';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  error = '';
  submitted = false;
  loading = false;
  sentmail = false;
  verificationCode = null;

  constructor(
    private userservice: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private titlecasePipe: TitleCasePipe,
    private alertService: AlertService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      usermail_input: ['', Validators.required],
      forname_input: ['', Validators.required],
      surname_input: ['', Validators.required],
      password_input: ['', Validators.required]
    });

  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmitRegister() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;


    var registerUser: User = new User();
    registerUser.emailadres = this.f.usermail_input.value;
    registerUser.forname = this.titlecasePipe.transform(this.f.forname_input.value);
    registerUser.surname = this.titlecasePipe.transform(this.f.surname_input.value);
    registerUser.password = this.f.password_input.value;


    this.userservice.registerRequest(registerUser).subscribe(data => {

      this.sentmail = data;

    }, error => {
      this.alertService.danger('Er is iets fout gegaan met registeren, probeer het later opnieuw');
      this.loading = false;
    });
  }

  VerifyRegistration() {

    if (this.verificationCode != null) {

      this.loading = true;

      this.userservice.confirmRegistration(this.verificationCode).subscribe(data => {
        if (data === true) {
          this.alertService.success('Het account is gecreëerd, je wordt nu teruggebracht naar het inlogscherm')

          setTimeout(() => {
            this.router.navigate(['']);
          },
            5000);
        }
        else if (data === false) {
          this.alertService.danger('Foute verificatie code')
          this.loading = false;
        }
      }, error => {
        this.alertService.danger('Er is iets fout gegaan met verifieren, probeer het later opnieuw')
        this.loading = false;
      });
    }
    else {
      this.alertService.warning('Vul a.u.b de verificatie code in')
    }
  }

}
