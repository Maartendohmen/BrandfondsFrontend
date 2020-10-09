import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Stock } from '../model/Stock';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  //baseUrl = 'https://brandfonds-backend.herokuapp.com/rest/day/';
  baseUrl = environment.API_URL + 'stock/';

  constructor(private http: HttpClient) { }

  getStock(): Observable<Stock> {
      return this.http.get<Stock>(this.baseUrl);
  }

  updateCurrentBottlesStock(amount: number): Observable<number>{
    return this.http.put<number>(this.baseUrl + 'editcurrentbottles/' + amount,amount)
  }

  updateReturnedBottlesStock(amount: number): Observable<number>{
    return this.http.put<number>(this.baseUrl + 'editreturnedbottles/' + amount,amount)
  }


}
