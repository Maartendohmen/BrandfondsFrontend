import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day } from '../model/Day';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  base

  //baseUrl = 'https://brandfonds-backend.herokuapp.com/rest/day/';
  baseUrl = environment.API_URL + 'day/';

  constructor(private http: HttpClient) { }

  getAllStripesFromUser(userid: number) : Observable<Day[]> {
    return this.http.get<Day[]>(this.baseUrl + userid.toString());
  }

  getStripesFromDayFromUser(userid: number, date: Date) : Observable<Day>{
    return this.http.get<Day>(this.baseUrl + userid + "/" + date);
  }

  addStripeForUser(userid: number, date: Date): Observable<number>
  {
    return this.http.get<number>(this.baseUrl+ 'addstripe/' + userid + "/" + date)
  }

  addStripesForUser(amount: number,userid: number, date: Date): Observable<number>
  {
    return this.http.put<number>(this.baseUrl+ 'addstripes/' + userid + "/" + date,amount)
  }

  removeStripeForUser(userid: number, date: Date): Observable<number>
  {
    return this.http.get<number>(this.baseUrl+ 'removestripe/' + userid + "/" + date)
  }

  removeStripesForUser(amount: number,userid: number, date: Date): Observable<number>
  {
    return this.http.put<number>(this.baseUrl+ 'removestripes/' + userid + "/" + date,amount)
  }

  getTotalStripesFromUser(userid: number): Observable<number>
  {
    return this.http.get<number>(this.baseUrl + userid + "/totalstripes")
  }

  getStripesSortedByMonthFromUser(userid: number): Observable<Map<string, number>>
  {
    return this.http.get<Map<string, number>>(this.baseUrl + userid + '/sortedbymonth')
  }
}
