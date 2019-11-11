import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/services/user.service';
import { StripeService } from 'src/app/services/stripe.service';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {

  //global param
  public loggedinUser: User;
  public groupstripesmenu: boolean = true;
  public personalstripesnumber: number;

  //individual striping param
  public selectedDate: Date = new Date();
  currentdate: NgbDateStruct = this.calendar.getToday();

  //group striping param
  public selectedUserID: number;
  public allusers: User[];
  public selectedUsers: User[] = [];

  //Overview
  public saldoColor: string = null;
  public totalStripes: Number = undefined;
  public totalstripesPerMonth: Map<string, number> = null;

  constructor(private calendar: NgbCalendar,
    private userService: UserService,
    private stripeService: StripeService,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit() {

    if (localStorage.getItem('Loggedin_User') === null) {
      this.router.navigateByUrl('');
    }

    this.loggedinUser = JSON.parse(localStorage.getItem('Loggedin_User'));

    this.onDateSelection(this.currentdate);

    this.RefreshAllUsers();
    this.RefreshTotalStripesFromUser();
    this.RefreshSaldoFromUser();
    this.RefreshTotalStripesPerMonthFromUser();

  }

  /////////////////////////////////////////////Set Screens/////////////////////////////////////////

  SetGroupScreen(e) {
    this.onDateSelection(this.currentdate);
    this.RefreshOwnTodayStripes();
    this.groupstripesmenu = true;
  }

  SetPersonalScreen(e) {
    this.onDateSelection(this.currentdate);
    this.groupstripesmenu = false;
  }

  /////////////////////////////////////////////Personal Striping/////////////////////////////////////////

  RemoveStripe(e) {

    if (this.personalstripesnumber > 0) {
      this.stripeService.removeStripeForUser(this.loggedinUser.id, this.selectedDate).subscribe(data => {
        this.stripeService.getStripesFromDayFromUser(this.loggedinUser.id, this.selectedDate).subscribe(day => {
          if (day) { //if day still exist after striping
            this.personalstripesnumber = day.stripes;
          }
          else {
            this.personalstripesnumber = 0;
          }

          this.RefreshTotalStripesFromUser();
          this.RefreshSaldoFromUser();
          this.RefreshTotalStripesPerMonthFromUser();
        })
      });
    }
  }

  AddStripe(e) {

    this.stripeService.addStripeForUser(this.loggedinUser.id, this.selectedDate).subscribe(data => {
      this.stripeService.getStripesFromDayFromUser(this.loggedinUser.id, this.selectedDate).subscribe(day => {
        this.personalstripesnumber = day.stripes;

        this.RefreshTotalStripesFromUser();
        this.RefreshSaldoFromUser();
        this.RefreshTotalStripesPerMonthFromUser();
      })
    });

  }

  onDateSelection(date: NgbDateStruct) {

    this.selectedDate = new Date(date.year, date.month, date.day);

    //correction for month enum starting at 0
    this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);

    this.stripeService.getStripesFromDayFromUser(this.loggedinUser.id, this.selectedDate).subscribe(day => {
      if (day != null) { //if day still exist after striping
        this.personalstripesnumber = day.stripes;
      }
      else {
        this.personalstripesnumber = 0;
      }
    })
  }

  /////////////////////////////////////////////Group Striping/////////////////////////////////////////

  AddToGroup(e) {

    //check if user is correctly selected and not already in group
    if (this.selectedUserID != undefined && this.selectedUsers.find(x => x.id == this.selectedUserID) == undefined) {

      var selecteduser = this.allusers.find(x => x.id == this.selectedUserID);

      //determain stripe count on current day
      this.stripeService.getStripesFromDayFromUser(selecteduser.id, this.selectedDate).subscribe(data => {

        if (data != null) {
          selecteduser.todaystripes = data.stripes;
        }
        else {
          selecteduser.todaystripes = 0;
        }
      });

      //add user to list
      this.selectedUsers.push(selecteduser);

    }
    //user is already in group
    else if (this.selectedUsers.find(x => x.id == this.selectedUserID) != undefined) {
      this.alertService.warning('Deze gebruiker is al toegevoegd')
    }
    //user is not selected
    else {
      this.alertService.danger("Selecteer a.u.b een gebruiker");
    }
  }

  RemoveFromGroup(userdid: number) {
    var selecteduser = this.selectedUsers.find(x => x.id == userdid);

    this.selectedUsers = this.selectedUsers.filter(obj => obj !== selecteduser);
  }

  /**
   * Add stripe from user in group
   * @param user User to which stripe will be added
   */
  AddGroupStripe(user: User) {

    this.stripeService.addStripeForUser(user.id, this.selectedDate).subscribe(data => {
      this.stripeService.getStripesFromDayFromUser(user.id, this.selectedDate).subscribe(day => {
        user.todaystripes = day.stripes;

        //update own values after transaction
        if (user.id === this.loggedinUser.id) {
          this.RefreshTotalStripesFromUser();
          this.RefreshSaldoFromUser();
          this.RefreshTotalStripesPerMonthFromUser();
        }
      })
    });
  }

  /**
   * Remove stripe from user in group
   * @param user user which stripe will be deleted
   */
  RemoveGroupStripe(user: User) {

    if (user.todaystripes > 0) {
      this.stripeService.removeStripeForUser(user.id, this.selectedDate).subscribe(data => {
        this.stripeService.getStripesFromDayFromUser(user.id, this.selectedDate).subscribe(day => {
          if (day) { //if day still exist after striping
            user.todaystripes = day.stripes;
          }
          else {
            user.todaystripes = 0;
          }
        });

        //update own values after transaction
        if (user.id === this.loggedinUser.id) {
          this.RefreshTotalStripesFromUser();
          this.RefreshSaldoFromUser();
          this.RefreshTotalStripesPerMonthFromUser();
        }
      });
    }
  }

  /////////////////////////////////////////////Refreshes/////////////////////////////////////////

  /**
   * Refresh list of all available users
   */
  RefreshAllUsers() {
    this.userService.getAll().subscribe(data => {
      this.allusers = data;
    });
  }

  /**
   * Refreshes the number of stripes for current data for loggedin user
   */
  RefreshOwnTodayStripes() {

    if (this.selectedUsers.find(x => x.id == this.loggedinUser.id) != undefined) {
      var selecteduser = this.selectedUsers.find(x => x.id == this.loggedinUser.id);
      this.stripeService.getStripesFromDayFromUser(selecteduser.id, this.selectedDate).subscribe(day => {
        if (day){ //if day still exist after striping
          selecteduser.todaystripes = day.stripes;
        }
        else
        {
          selecteduser.todaystripes = 0;
        }

      });
    }
  }

  /**
   * Refreshes the current total stripes from user
   */
  RefreshTotalStripesFromUser() {
    this.stripeService.getTotalStripesFromUser(this.loggedinUser.id).subscribe(data => {
      this.totalStripes = data;
    });
  }

  /**
   * Refreshes the saldo from the logged in user
   */
  RefreshSaldoFromUser() {
    this.userService.getSaldoFromUser(this.loggedinUser.id).subscribe(data => {
      this.loggedinUser.saldo = data;
    });

    if (this.loggedinUser.saldo < 0.1) {
      this.saldoColor = 'red'
    }
    else {
      this.saldoColor = 'green'
    }
  }

  RefreshTotalStripesPerMonthFromUser() {
    this.stripeService.getStripesSortedByMonthFromUser(this.loggedinUser.id).subscribe(data => {
      this.totalstripesPerMonth = data;
    });
  }

  /////////////////////////////////////////////Log out/////////////////////////////////////////

  /**
   * Logs user out
   * @param e event from button
   */
  LogOut(e) {
    localStorage.removeItem('Loggedin_User');
    this.router.navigateByUrl('');
  }





}
