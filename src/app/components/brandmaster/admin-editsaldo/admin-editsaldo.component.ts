import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'ngx-alerts';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-admin-editsaldo',
  templateUrl: './admin-editsaldo.component.html',
  styleUrls: ['./admin-editsaldo.component.css']
})
export class AdminEditsaldoComponent implements OnInit {

  @Input() allusersstripes: Map<User, number>;
  @Output() RefreshListOfUsers = new EventEmitter<any>();

  //edit user Saldo
  selectedUser_Saldo = null; //not type safe cause typescript has no support for tuples
  selectedUserSaldo: number;

  constructor(
    private alertService: AlertService,
    private userService: UserService
    ) { }

  ngOnInit() {
  }

  EditSaldo(selectedUser) {
    this.selectedUser_Saldo = selectedUser;
  }

  SaveSaldo() {
    if (this.selectedUserSaldo || this.selectedUserSaldo === 0) {
      var selectedUserSaldo = this.selectedUserSaldo.toString();
      var inputsaldo = null;

      if (selectedUserSaldo.includes(',')) {
        inputsaldo = +selectedUserSaldo.replace(/,/g, '');
      }
      else {
        inputsaldo = +selectedUserSaldo * 100;
      }

      this.userService.setSaldoFromUser(+inputsaldo, this.selectedUser_Saldo.key.id).subscribe(data => {
        this.alertService.success('Het saldo is aangepast')
        this.RefreshListOfUsers.emit();

      }, error => {
        this.alertService.danger(error.error.message)
      });
    }

    this.selectedUserSaldo = undefined;
    this.selectedUser_Saldo = undefined;
  }
}
