import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day } from '../model/Day';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  //baseUrl = 'https://brandfonds-backend.herokuapp.com/rest/day/';
  baseUrl = 'http://localhost:8080/rest/day/';
  //baseUrl = 'http://77.175.243.68:9000/rest/day/';

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

  removeStripeForUser(userid: number, date: Date): Observable<number>
  {
    return this.http.get<number>(this.baseUrl+ 'removestripe/' + userid + "/" + date)
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
