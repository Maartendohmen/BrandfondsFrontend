import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = 'http://localhost:8080/rest/user';

  constructor(private http: HttpClient) { }

  Login(user: User) {
    return this.http.post(this.baseUrl + '/login', user);
  }

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl);
  }
}
