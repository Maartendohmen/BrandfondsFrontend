import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthenticationRequest } from '../model/authentication/AuthenticationRequest';
import { User } from '../model/User';
import { Observable } from 'rxjs';
import { AuthenticationResponse } from '../model/authentication/AuthenticationResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenicateService {


  //baseUrl = 'https://brandfonds-backend.herokuapp.com/rest/auth/';
  baseUrl = environment.API_URL + 'auth/';

  constructor(private http: HttpClient) { }

  Login(AuthenticationRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(this.baseUrl, AuthenticationRequest);
  }

  registerRequest(user: User): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register', user);
  }

  confirmRegistration(randomstring: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + "registerconformation/" + randomstring)
  }

  setActivateUser(userid: number, isActivated: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + "activate-user/" + userid + "/" + isActivated)
  }

  passwordChangeRequest(mailadres: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'forgotpassword/' + mailadres)
  }

  checkPasswordResetLink(passwordresetstring: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'resetpasswordcode/' + passwordresetstring)
  }

  passwordChange(passwordtoken: string, newpassword: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + "resetpassword/" + passwordtoken, newpassword)
  }
}
