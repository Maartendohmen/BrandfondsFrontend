import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/model/User';
import { AlertService } from 'ngx-alerts';
import { StripeService } from 'src/app/services/stripe.service';

@Component({
  selector: 'app-admin-editpunishmentstripe',
  templateUrl: './admin-editpunishmentstripe.component.html',
  styleUrls: ['./admin-editpunishmentstripe.component.css']
})
export class AdminEditpunishmentstripeComponent implements OnInit {

  @Input() alluserpunishmentstripes: Map<User, number>;
  @Output() RefreshListOfUsers = new EventEmitter<any>();

  constructor(
    private alertService: AlertService,
    private stripeService: StripeService
  ) { }

  ngOnInit() {
  }

  selectedUser_PunishmentStripes = null;
  selectedUserPunishmentStripes: number;

  
  EditPunishmentStripes(selectedUser) {
    this.selectedUser_PunishmentStripes = selectedUser;
  }

  SavePunishmentStripes() {

    if (this.selectedUserPunishmentStripes || this.selectedUserPunishmentStripes === 0) {
      var changedamount = this.selectedUserPunishmentStripes - this.selectedUser_PunishmentStripes.value;

      console.log('Changeamount : ' + changedamount)

      if (changedamount > 0) {
        this.stripeService.addStripesForUser(changedamount, this.selectedUser_PunishmentStripes.key.id, new Date(1900, 1)).subscribe(data => {
          if (data) {
            this.alertService.success('Het aantal strepen is aangepast')
            this.RefreshListOfUsers.emit();
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
            this.RefreshListOfUsers.emit();
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

}
