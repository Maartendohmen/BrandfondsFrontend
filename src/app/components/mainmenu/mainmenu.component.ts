import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/services/user.service';
import { StripeService } from 'src/app/services/stripe.service';
import { Day } from 'src/app/model/Day';
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

  }

  /////////////////////////////////////////////Set Screens/////////////////////////////////////////

  SetGroupScreen(e) {
    this.onDateSelection(this.currentdate);
    this.RefreshOwnChanges();
    this.groupstripesmenu = true;
  }

  SetPersonalScreen(e) {
    this.onDateSelection(this.currentdate);
    this.groupstripesmenu = false;
  }

    /////////////////////////////////////////////Personal Striping/////////////////////////////////////////

  RemoveStripe(e) {

    if (this.personalstripesnumber > 0) {
      this.stripeService.RemoveStripeForUser(this.loggedinUser.id, this.selectedDate).subscribe(data => {
        this.stripeService.getStripesFromDayFromUser(this.loggedinUser.id, this.selectedDate).subscribe(day => {
          this.personalstripesnumber = day.stripes;
        })
      });
    }
  }

  AddStripe(e) {

    this.stripeService.addStripeForUser(this.loggedinUser.id, this.selectedDate).subscribe(data => {
      this.stripeService.getStripesFromDayFromUser(this.loggedinUser.id, this.selectedDate).subscribe(day => {
        this.personalstripesnumber = day.stripes;
      })
    });
  }

  onDateSelection(date: NgbDateStruct) {

    this.selectedDate = new Date(date.year, date.month, date.day);

    this.stripeService.getStripesFromDayFromUser(this.loggedinUser.id, this.selectedDate).subscribe(day => {
      if (day != null) {
        this.personalstripesnumber = day.stripes;
      }
      else {
        this.personalstripesnumber = 0;
      }
    })
  }

    /////////////////////////////////////////////Group Striping/////////////////////////////////////////

  RefreshAllUsers() {
    this.userService.getAll().subscribe(data => {
      this.allusers = data;
    });
  }

  RefreshOwnChanges()
  {
    
    if (this.selectedUsers.find(x => x.id == this.loggedinUser.id) != undefined)
    {
      var selecteduser = this.selectedUsers.find(x => x.id == this.loggedinUser.id);
      this.stripeService.getStripesFromDayFromUser(selecteduser.id, this.selectedDate).subscribe(day => {
        selecteduser.todaystripes = day.stripes;
      })
    }
  }


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

  AddGroupStripe(user: User) {

    this.stripeService.addStripeForUser(user.id, this.selectedDate).subscribe(data => {
      this.stripeService.getStripesFromDayFromUser(user.id, this.selectedDate).subscribe(day => {
        user.todaystripes = day.stripes;
      })
    });
  }

  RemoveGroupStripe(user: User) {

    if (user.todaystripes > 0) {
      this.stripeService.RemoveStripeForUser(user.id, this.selectedDate).subscribe(data => {
        this.stripeService.getStripesFromDayFromUser(user.id, this.selectedDate).subscribe(day => {
          user.todaystripes = day.stripes;
        })
      });
    }
  }

    /////////////////////////////////////////////Log out/////////////////////////////////////////

  LogOut(e) {
    localStorage.removeItem('Loggedin_User');
    this.router.navigateByUrl('');
  }



}
