import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'ngx-alerts';
import { User } from 'src/app/model/User';
import UserStripe from 'src/app/model/UserStripes';

@Component({
  selector: 'app-admin-editsaldo',
  templateUrl: './admin-editsaldo.component.html',
  styleUrls: ['./admin-editsaldo.component.css']
})
export class AdminEditsaldoComponent implements OnInit {

  @Input() allusersstripes: UserStripe[];
  @Output() RefreshListOfUsers = new EventEmitter<any>();

  datasource: UserStripe[] = [];
  selectedamount: number = null;

  constructor(
    private alertService: AlertService,
    private userService: UserService
  ) { }

  ngOnChanges(changes: SimpleChange): void {
    this.datasource = this.allusersstripes  
  }

  ngOnInit() {
    this.datasource = this.allusersstripes;
  }

  SetSelectedAmount(amount) {
    this.selectedamount = amount;
  }

  //todo check if other stuff then numbers, points or comma's are given in, and reject those
  SaveSaldo(selectedUser: UserStripe, inputsaldo) {
    

    if (inputsaldo.toString() !== this.selectedamount.toString()) {

      if (inputsaldo != null || inputsaldo === 0) {


        var selectedUserSaldo = inputsaldo.toString();
        var inputsaldo = null;

        if (selectedUserSaldo.includes(',')) {
          inputsaldo = +selectedUserSaldo.replace(/,/g, '');
        }
        else {
          inputsaldo = +selectedUserSaldo * 100;
        }

        this.userService.setSaldoFromUser(+inputsaldo, selectedUser.user.id).subscribe(data => {
          this.alertService.success('Het saldo is aangepast')
          this.RefreshListOfUsers.emit();

        }, error => {
          this.alertService.danger(error.error.message)
        });
      }
    }
  }
}
