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

  //edit user details
  selectedUser = null; //not type safe cause typescript has no support for tuples
  selectedUserSaldo: string;
  SelectedUsertotalStripes: number;

  constructor(private alertService: AlertService,
              private userService: UserService,
              private stripeService: StripeService) { }

  ngOnInit() {

    this.RefreshListOfUsers();

  }

  EditDetails(selectedUser)
  {
      this.selectedUser = selectedUser;
      console.log(this.selectedUser.key.id);
  }

  SaveDetails()
  {
    if (this.selectedUserSaldo != undefined && this.SelectedUsertotalStripes != undefined)
    {
      this.alertService.warning('Je kan niet het saldo en het totaal aantal strepen tegelijk aanpassen')
      this.selectedUserSaldo = undefined;
      this.SelectedUsertotalStripes = undefined;
    }
    else if (this.selectedUserSaldo != undefined)
    {
       var removedcommanumber = this.selectedUserSaldo.replace(/,/g, '')

      this.userService.setSaldoFromUser(+removedcommanumber,this.selectedUser.key.id).subscribe(data => {
        if (data == true)
        {
          this.alertService.success('Het saldo is aangepast')
          this.RefreshListOfUsers();
        }
        else
        {
          this.alertService.warning('Er is iets fout gegaan met het opslaan, probeer het later opnieuw')
        }
      }, error => {
          this.alertService.warning('Er is iets fout gegaan met het opslaan, probeer het later opnieuw')
      });
    }

    else if (this.SelectedUsertotalStripes != undefined)
    {
      //todo need to add function to add punishstripes
      var changedamount = this.SelectedUsertotalStripes - this.selectedUser.value;

      console.log(changedamount)

      if (changedamount > 0)
      {
      
      }

      else if (changedamount < 0)
      {

      }
    }

    this.selectedUserSaldo = undefined;
    this.SelectedUsertotalStripes = undefined;
    this.selectedUser = undefined;
  }

  RefreshListOfUsers()
  {
    this.allusers = [];
    this.allusersstripes.clear();

    //gets all users
    this.userService.getAll().subscribe(data => 
      {
        this.allusers = [];
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
