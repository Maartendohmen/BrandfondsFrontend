import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day } from '../model/Day';
import { environment } from '../../environments/environment';
import { DepositRequest } from '../model/DepositRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //baseUrl = 'https://brandfonds-backend.herokuapp.com/rest/user/';
  baseUrl = environment.API_URL + 'user/';

  constructor(private http: HttpClient) { }


  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getSaldoFromUser(userid: number): Observable<number> {
    return this.http.get<number>(this.baseUrl + userid + '/saldo')
  }

  setSaldoFromUser(amount: number, userid: number): Observable<boolean> {
    return this.http.put<boolean>(this.baseUrl + userid + "/saldo", amount);
  }

  depositRequest(userid: number, amount: number): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + userid + '/deposit', amount)
  }

  getAllDepositRequest(): Observable<DepositRequest[]> {
    return this.http.get<DepositRequest[]>(this.baseUrl + 'deposit')
  }

  acceptDepositRequest(depositRequestid: number): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + 'depositapprove/' + depositRequestid)
  }

  rejectDepositRequest(depositRequestid: number): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + 'depositreject/' + depositRequestid)
  }



}
