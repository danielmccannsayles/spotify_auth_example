import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authObject: string | null = null
  userAuthenticated: boolean = false

  constructor() { }

  ngOnInit(): void {
    const authObjectJson = localStorage.getItem('auth_object')
    if (authObjectJson){
      this.authObject = JSON.parse(authObjectJson)
      this.userAuthenticated = true
    }
  }

}
