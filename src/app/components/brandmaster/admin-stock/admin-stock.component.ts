import { Component, OnInit, Input } from '@angular/core';
import { Stock } from 'src/app/model/Stock';
import { StockService } from 'src/app/services/stock.service';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-admin-stock',
  templateUrl: './admin-stock.component.html',
  styleUrls: ['./admin-stock.component.css']
})
export class AdminStockComponent implements OnInit {

  @Input() currentstock: Stock

  constructor(
    private alertService: AlertService,
    private stockService: StockService,
  ) { }

  ngOnInit() {

  }

  EditCurrentBottles(amount) {
    // check if the user has entered a new value
    if (amount) {
      this.stockService.updateCurrentBottlesStock(amount).subscribe(result => {
        this.alertService.success('Huidig aantal flessen succesvol aangepast');
      }, error => {
        this.alertService.warning('Er is iets fout gegaan, probeer het later opnieuw')
      })
    }
  };

  EditReturnedBottles(amount) {
    // check if the user has entered a new value
    if (amount) {
      this.stockService.updateReturnedBottlesStock(amount).subscribe(result => {
        this.alertService.success('Het aantal ingeleverde flessen is succesvol aangepast');
      }, error => {
        this.alertService.warning('Er is iets fout gegaan, probeer het later opnieuw')
      })
    }

  };

}
