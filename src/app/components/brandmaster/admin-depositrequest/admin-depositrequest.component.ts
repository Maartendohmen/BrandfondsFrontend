import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { UserService } from 'src/app/services/user.service';
import { DepositRequest } from 'src/app/model/DepositRequest';

@Component({
  selector: 'app-admin-depositrequest',
  templateUrl: './admin-depositrequest.component.html',
  styleUrls: ['./admin-depositrequest.component.css']
})
export class AdminDepositrequestComponent implements OnInit {

  @Input() alldepositrequests: DepositRequest[]
  @Output() RefreshListOfDeposits = new EventEmitter<any>();
  @Output() RefreshListOfUsers = new EventEmitter<any>();

  constructor(
    private alertService:AlertService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  RejectDepositRequest(depositRequestid: number) {
    this.userService.rejectDepositRequest(depositRequestid).subscribe(data => {
      if (data == false || !data) {
        this.alertService.danger('Er is iets fout gegaan, probeer het later opnieuw');
      }

      this.RefreshListOfDeposits.emit();
    });
  }

  AcceptRepositRequest(depositRequestid: number) {

    this.userService.acceptDepositRequest(depositRequestid).subscribe(data => {
      if (data == false || !data) {
        this.alertService.danger('Er is iets fout gegaan, probeer het later opnieuw');
      }

      this.RefreshListOfDeposits.emit();
      this.RefreshListOfUsers.emit();
    });
  }

}
