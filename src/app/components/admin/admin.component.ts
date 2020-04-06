import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { UserService } from 'src/app/services/user.service';
import { StripeService } from 'src/app/services/stripe.service';
import { User } from 'src/app/model/User';
import { map } from 'rxjs/operators';
import { DepositRequest } from 'src/app/model/DepositRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  allusers: User[] = [];
  allusersstripes: Map<User, number> = new Map();

  alldepositrequests: DepositRequest[] = [];

  //edit user details
  selectedUser = null; //not type safe cause typescript has no support for tuples
  selectedUserSaldo: string;
  SelectedUsertotalStripes: number;

  constructor(private alertService: AlertService,
    private userService: UserService,
    private router: Router,
    private stripeService: StripeService) { }

  ngOnInit() {

    this.RefreshListOfUsers();
    this.RefreshListOfDeposits();

  }

  EditDetails(selectedUser) {
    this.selectedUser = selectedUser;
    console.log(this.selectedUser.key.id);
  }

  SaveDetails() {
    if (this.selectedUserSaldo != undefined && this.SelectedUsertotalStripes != undefined) {
      this.alertService.warning('Je kan niet het saldo en het totaal aantal strepen tegelijk aanpassen')
      this.selectedUserSaldo = undefined;
      this.SelectedUsertotalStripes = undefined;
    }
    else if (this.selectedUserSaldo != undefined) {
      var inputsaldo = null;

      if (this.selectedUserSaldo.includes(',')) {
        inputsaldo = +this.selectedUserSaldo.replace(/,/g, '');
      }
      else {
        inputsaldo = +this.selectedUserSaldo * 100;
      }

      this.userService.setSaldoFromUser(+inputsaldo, this.selectedUser.key.id).subscribe(data => {
        this.alertService.success('Het saldo is aangepast')
        this.RefreshListOfUsers();

      }, error => {
        this.alertService.danger(error.error.message)
      });
    }

    else if (this.SelectedUsertotalStripes != undefined) {
      //todo need to add function to add punishstripes
      var changedamount = this.SelectedUsertotalStripes - this.selectedUser.value;

      console.log('Changeamount : ' + changedamount)

      if (changedamount > 0) {
        this.stripeService.addStripesForUser(changedamount, this.selectedUser.key.id, new Date(1900, 1)).subscribe(data => {
          if (data) {
            this.alertService.success('Het aantal strepen is aangepast')
            this.RefreshListOfUsers();
          }
          else {
            this.alertService.warning('Er is iets fout gegaan met het opslaan, probeer het later opnieuw')
          }
        }, error => {
          this.alertService.warning('Er is iets fout gegaan met het opslaan, probeer het later opnieuw')
        });
      }

      else if (changedamount < 0) {
        this.stripeService.removeStripesForUser(Math.abs(changedamount), this.selectedUser.key.id, new Date(1900, 1)).subscribe(data => {
          if (data) {
            this.alertService.success('Het aantal strepen is aangepast')
            this.RefreshListOfUsers();
          }
          else {
            this.alertService.warning('Er is iets fout gegaan met het opslaan, probeer het later opnieuw')
          }
        }, error => {
          this.alertService.warning('Er is iets fout gegaan met het opslaan, probeer het later opnieuw')
        });
      }
    }

    this.selectedUserSaldo = undefined;
    this.SelectedUsertotalStripes = undefined;
    this.selectedUser = undefined;
  }

  RejectDepositRequest(depositRequestid: number) {
    this.userService.rejectDepositRequest(depositRequestid).subscribe(data => {
      if (data == false || !data) {
        this.alertService.danger('Er is iets fout gegaan, probeer het later opnieuw');
      }

      this.RefreshListOfDeposits();
    });
  }

  AcceptRepositRequest(depositRequestid: number) {
    this.userService.acceptDepositRequest(depositRequestid).subscribe(data => {
      if (data == false || !data) {
        this.alertService.danger('Er is iets fout gegaan, probeer het later opnieuw');
      }

      this.RefreshListOfDeposits();
      this.RefreshListOfUsers();
    });
  }

  RefreshListOfUsers() {
    this.allusers = [];
    this.allusersstripes.clear();

    //gets all users
    this.userService.getAll().subscribe(data => {
      this.allusers = [];
      this.allusers = data;

      //foreach user, check total amount of stripes
      this.allusers.forEach(user => {
        this.stripeService.getTotalStripesFromUser(user.id).subscribe(totalstripes => {
          this.allusersstripes.set(user, totalstripes);
        });
      });

      //print error if something goes wrong
    }, error => {
      console.log(error);
    });
  }

  RefreshListOfDeposits() {
    this.userService.getAllDepositRequest().subscribe(result => {
      this.alldepositrequests = result;
      this.alldepositrequests = this.alldepositrequests.filter(depositrequest => depositrequest.handledDate === null)
    }, error => {
      console.log(error);
    });
  }


  LogOut(e) {
    localStorage.removeItem('Loggedin_User');
    this.router.navigateByUrl('');
  }

}
