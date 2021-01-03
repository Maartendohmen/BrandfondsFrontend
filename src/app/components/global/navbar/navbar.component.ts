import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() loggedinUser: User;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  LogOut(e) {
    localStorage.clear();
    this.router.navigateByUrl('');
  }
}
