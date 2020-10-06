import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { UserService } from 'src/app/services/user.service';
import { StripeService } from 'src/app/services/stripe.service';
import { User } from 'src/app/model/User';
import { DepositRequest } from 'src/app/model/DepositRequest';
import { Router } from '@angular/router';
import UserStripe from 'src/app/model/UserStripes';
import { Stock } from 'src/app/model/Stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public loggedinUser: User;

  allusers: User[] = [];
  allusersstripes: UserStripe[] = [];
  alluserpunishmentstripes: UserStripe[] = []

  alldepositrequests: DepositRequest[] = [];

  currentstock: Stock;

  //edit user Saldo
  selectedUser_Saldo = null; //not type safe cause typescript has no support for tuples
  selectedUserSaldo: number;

  selectedUser_PunishmentStripes = null;
  selectedUserPunishmentStripes: number;



  constructor(private alertService: AlertService,
    private userService: UserService,
    private stripeService: StripeService,
    private stockService: StockService,
    private router: Router,) { }

  ngOnInit() {
    this.loggedinUser = JSON.parse(localStorage.getItem('Loggedin_User'));

    this.RefreshListOfUsers();
    this.RefreshListOfDeposits();
    this.RefreshStock();

  }

  RefreshListOfUsers() {
    this.allusers = [];
    this.allusersstripes = [];
    this.alluserpunishmentstripes = []

    //gets all users
    this.userService.getAll().subscribe(data => {
      this.allusers = [];
      this.allusers = data;


      this.allusers.forEach(user => {

        //foreach user, check total amount of stripes
        this.stripeService.getTotalStripesFromUser(user.id).subscribe(totalstripes => {
          this.allusersstripes.push({ user: user, stripetotal: totalstripes });
        });

        //foreach user, check amount of punishment stripes
        this.stripeService.getStripesFromDayFromUser(user.id, new Date(1900, 1)).subscribe(totalpunishmentstripes => {
          if (totalpunishmentstripes) {
            this.alluserpunishmentstripes.push({ user: user, stripetotal: totalpunishmentstripes.stripes });
          }
          else {
            this.alluserpunishmentstripes.push({ user: user, stripetotal: 0 });
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

  RefreshStock(){
    this.stockService.getStock().subscribe(result => {
      this.currentstock = result;
    }, error => {
      console.log(error);
    })
  }

  LogOut(e) {
    localStorage.removeItem('Loggedin_User');
    this.router.navigateByUrl('');
  }

}
