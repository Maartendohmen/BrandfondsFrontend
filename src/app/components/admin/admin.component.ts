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
  alluserpunishmentstripes: Map<User, number> = new Map();

  alldepositrequests: DepositRequest[] = [];

  //edit user Saldo
  selectedUser_Saldo = null; //not type safe cause typescript has no support for tuples
  selectedUserSaldo: number;

  selectedUser_PunishmentStripes = null;
  selectedUserPunishmentStripes: number;



  constructor(private alertService: AlertService,
    private userService: UserService,
    private router: Router,
    private stripeService: StripeService) { }

  ngOnInit() {

    this.RefreshListOfUsers();
    this.RefreshListOfDeposits();

  }

  EditSaldo(selectedUser) {
    this.selectedUser_Saldo = selectedUser;
  }

  SaveSaldo() {

    if(this.selectedUserSaldo || this.selectedUserSaldo === 0)
    {
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
        this.RefreshListOfUsers();

      }, error => {
        this.alertService.danger(error.error.message)
      });
    }



    this.selectedUserSaldo = undefined;
    this.selectedUser_Saldo = undefined;
  }

  EditPunishmentStripes(selectedUser){
    this.selectedUser_PunishmentStripes = selectedUser;
  }

  SavePunishmentStripes(){

    if (this.selectedUserPunishmentStripes || this.selectedUserPunishmentStripes === 0)
    {
      var changedamount = this.selectedUserPunishmentStripes - this.selectedUser_PunishmentStripes.value;

      console.log('Changeamount : ' + changedamount)

      if (changedamount > 0) {
        this.stripeService.addStripesForUser(changedamount, this.selectedUser_PunishmentStripes.key.id, new Date(1900, 1)).subscribe(data => {
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
        this.stripeService.removeStripesForUser(Math.abs(changedamount), this.selectedUser_PunishmentStripes.key.id, new Date(1900, 1)).subscribe(data => {
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
      this.selectedUserPunishmentStripes = undefined;
      this.selectedUser_PunishmentStripes = undefined;
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
    this.alluserpunishmentstripes.clear();

    //gets all users
    this.userService.getAll().subscribe(data => {
      this.allusers = [];
      this.allusers = data;

      
      this.allusers.forEach(user => {

        //foreach user, check total amount of stripes
        this.stripeService.getTotalStripesFromUser(user.id).subscribe(totalstripes => {
          this.allusersstripes.set(user, totalstripes);
        });

        //foreach user, check amount of punishment stripes
        this.stripeService.getStripesFromDayFromUser(user.id,new Date(1900, 1)).subscribe(totalpunishmentstripes => {
          if(totalpunishmentstripes)
          {
            this.alluserpunishmentstripes.set(user, totalpunishmentstripes.stripes);
          }
          else
          {
            this.alluserpunishmentstripes.set(user,0);
          }
        })
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
