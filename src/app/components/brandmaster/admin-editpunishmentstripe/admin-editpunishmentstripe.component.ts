import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { User } from 'src/app/model/User';
import { AlertService } from 'ngx-alerts';
import { StripeService } from 'src/app/services/stripe.service';
import UserStripe from 'src/app/model/UserStripes';

@Component({
  selector: 'app-admin-editpunishmentstripe',
  templateUrl: './admin-editpunishmentstripe.component.html',
  styleUrls: ['./admin-editpunishmentstripe.component.css']
})
export class AdminEditpunishmentstripeComponent implements OnInit {

  @Input() alluserpunishmentstripes: UserStripe[];
  @Output() RefreshListOfUsers = new EventEmitter<any>();

  datasource: UserStripe[] = [];
  selectedamount: number = null;

  constructor(
    private alertService: AlertService,
    private stripeService: StripeService
  ) { }
  
  ngOnChanges(changes: SimpleChange): void {
    this.datasource = this.alluserpunishmentstripes    
  }

  ngOnInit() {
    this.datasource = this.alluserpunishmentstripes
  }

  SetSelectedAmount(amount) {
    this.selectedamount = amount;
  }

  SavePunishmentStripes(selectedUser: UserStripe, inputsaldo) {

    if (inputsaldo.toString() !== this.selectedamount.toString()) {

      if (inputsaldo || inputsaldo === 0) {
        var changedamount = inputsaldo - selectedUser.stripetotal;

        console.log('Changeamount : ' + changedamount)

        if (changedamount > 0) {
          this.stripeService.addStripesForUser(changedamount, selectedUser.user.id, new Date(1900, 1)).subscribe(data => {
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
          this.stripeService.removeStripesForUser(Math.abs(changedamount), selectedUser.user.id, new Date(1900, 1)).subscribe(data => {
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
    }
  }

}
