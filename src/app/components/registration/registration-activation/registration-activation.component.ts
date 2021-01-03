import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { UserService } from 'src/app/services/user.service';
import { AuthenicateService } from 'src/app/services/authenicate.service';

@Component({
  selector: 'app-registration-activation',
  templateUrl: './registration-activation.component.html',
  styleUrls: ['./registration-activation.component.css']
})
export class RegistrationActivationComponent implements OnInit {

  doneloading = false;
  userid = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    protected authService: AuthenicateService,
    private router: Router) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.userid = params['userid'];

      this.authService.setActivateUser(this.userid, true).subscribe(data => {
        this.doneloading = true;

        setTimeout(() => {
          this.router.navigate(['']);
        },
          7000);

      }, error => {
        if (error.error.type == "UserNotFoundException") {
          this.router.navigateByUrl('/');
          this.alertService.danger(error.error.message);
        }
      })
    })
  }

}
