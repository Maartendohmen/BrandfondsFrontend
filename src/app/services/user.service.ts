import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day } from '../model/Day';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //baseUrl = 'https://brandfonds-backend.herokuapp.com/rest/user/';
  baseUrl = environment.API_URL + 'user/';

  constructor(private http: HttpClient) { }

  Login(user: User) {
    return this.http.post(this.baseUrl + 'login', user);
  }

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl);
  }

  getSaldoFromUser(userid: number) : Observable<number>{
    return this.http.get<number>(this.baseUrl + userid + '/saldo')
  }

  setSaldoFromUser(amount: number, userid: number) : Observable<boolean>
  {
    return this.http.put<boolean>(this.baseUrl + userid + "/saldo",amount);
  }

  //needed responstype setting so answer could be read as string
  registerRequest(user:User): Observable<boolean>{
    return this.http.post<boolean>(this.baseUrl + 'register',user);
  }

  confirmRegistration(randomstring: string): Observable<boolean>{
    return this.http.get<boolean>(this.baseUrl + "registerconformation/" + randomstring)
  }

  passwordChangeRequest(mailadres: string): Observable<boolean>{
    return this.http.get<boolean>(this.baseUrl + 'forgotpassword/' + mailadres)
  }

  checkPasswordResetLink(passwordresetstring: string): Observable<boolean>{
    return this.http.get<boolean>(this.baseUrl + 'resetpasswordcode/' + passwordresetstring)
  }

  passwordChange(passwordtoken: string, newpassword: string):Observable<boolean>{
    return this.http.post<boolean>(this.baseUrl + "resetpassword/" + passwordtoken,newpassword)
  }

}
