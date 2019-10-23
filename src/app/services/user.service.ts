import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day } from '../model/Day';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  //baseUrl = 'https://brandfonds-backend.herokuapp.com/rest/user/';
  baseUrl = 'http://localhost:8080/rest/user/';
  //baseUrl = 'http://77.175.243.68:9000/rest/user/';

  constructor(private http: HttpClient) { }

  Login(user: User) {
    return this.http.post(this.baseUrl + 'login', user);
  }

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl);
  }

  //needed responstype setting so answer could be read as string
  registerRequest(user:User): Observable<String>{
    return this.http.post<String>(this.baseUrl + 'register',user,{responseType: 'text' as 'json'});
  }

  confirmRegistration(randomstring: String): Observable<Boolean>{
    return this.http.get<boolean>(this.baseUrl + "registerconformation/" + randomstring)
  }

}
