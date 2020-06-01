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

  public loggedinUser: User;

  allusers: User[] = [];
  allusersstripes: Map<User, number> = new Map();
  alluserpunishmentstripes: Map<User, number> = new Map();

  alldepositrequests: DepositRequest[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private stripeService: StripeService
  ) { }

  ngOnInit() {
    this.loggedinUser = JSON.parse(localStorage.getItem('Loggedin_User'));

    this.RefreshListOfUsers();
    this.RefreshListOfDeposits();
  }


  RefreshListOfUsers() {

    console.log("Refreshing users ....");
    

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
        this.stripeService.getStripesFromDayFromUser(user.id, new Date(1900, 1)).subscribe(totalpunishmentstripes => {
          if (totalpunishmentstripes) {
            this.alluserpunishmentstripes.set(user, totalpunishmentstripes.stripes);
          }
          else {
            this.alluserpunishmentstripes.set(user, 0);
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
      console.log(this.alldepositrequests);
      
    }, error => {
      console.log(error);
    });
  }

  LogOut(e) {
    localStorage.removeItem('Loggedin_User');
    this.router.navigateByUrl('');
  }

}
