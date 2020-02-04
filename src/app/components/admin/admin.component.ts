import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { UserService } from 'src/app/services/user.service';
import { StripeService } from 'src/app/services/stripe.service';
import { User } from 'src/app/model/User';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  allusers: User[] = [];
  allusersstripes: Map<User,number> = new Map();

  constructor(private alertService: AlertService,
              private userService: UserService,
              private stripeService: StripeService) { }

  ngOnInit() {

    //gets all users
    this.userService.getAll().subscribe(data => 
      {
        this.allusers = data;
        
        //foreach user, check total amount of stripes
        this.allusers.forEach(user => {
          this.stripeService.getTotalStripesFromUser(user.id).subscribe(totalstripes => {
            this.allusersstripes.set(user,totalstripes);
          });   
        });


        //print error if something goes wrong
      }, error => {
        console.log(error);
      });
  }

}
