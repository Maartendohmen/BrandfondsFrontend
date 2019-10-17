import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/services/user.service';
import { StripeService } from 'src/app/services/stripe.service';
import { Day } from 'src/app/model/Day';

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
  public selectedUsers: User[];

  constructor(private calendar: NgbCalendar,
    private userService: UserService,
    private stripeService: StripeService,
    private router: Router) { }

  ngOnInit() {

    if (localStorage.getItem('Loggedin_User') === null) {
      this.router.navigateByUrl('');
    }

    this.loggedinUser = JSON.parse(localStorage.getItem('Loggedin_User'));

    this.onDateSelection(this.currentdate);
    this.RefreshAllUsers();

  }

  SetGroupScreen(e) {
    this.groupstripesmenu = true;
    this.RefreshAllUsers();
  }

  SetPersonalScreen(e) {
    this.groupstripesmenu = false;
  }

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

  LogOut(e) {
    localStorage.removeItem('Loggedin_User');
    this.router.navigateByUrl('');
  }

  RefreshAllUsers() {
    this.userService.getAll().subscribe(data => {
      this.allusers = data;
    });
  }

  SelectUser(e)
  {
    //Get User and add it to selected user list
  }



}
