import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  public newPasswordForm: FormGroup;

  passwordtoken = '';

  error = '';
  submitted = false;
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.passwordtoken = params['link'];
      this.userService.checkPasswordResetLink(this.passwordtoken).subscribe(active => {
        if (!active) {
          this.router.navigateByUrl('/');
          this.alertService.danger("Link bestaat niet of is verlopen");
        }
      })
    })

    this.newPasswordForm = this.formBuilder.group({
      password_input: ['', Validators.required],
      passwordconformation_input: ['', Validators.required]
    });


  }

  get f() {
    return this.newPasswordForm.controls;
  }

  onSubmitPassword() {
    if (this.f.password_input.value == this.f.passwordconformation_input.value) {
      this.userService.passwordChange(this.passwordtoken, this.f.password_input.value).subscribe(data => {
        this.alertService.success('Het wachtwoord is veranderd, je wordt nu teruggebracht naar het inlogscherm')

        setTimeout(() => {
          this.router.navigate(['']);
        },
          5000);
      },
        error => {
          this.loading = false;
            this.alertService.warning('Er is iets fout gegaan, probeer het later opnieuw')
        });
    } else {
      this.alertService.warning('Zorg dat in beide velden hetzelfde wachtwoord staat')
    }



  }

}
