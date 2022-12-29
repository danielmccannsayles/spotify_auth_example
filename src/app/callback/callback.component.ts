import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccessTokenService } from '../access_token_service/access-token.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(private accessTokenService: AccessTokenService, private _router: Router) { }

  ngOnInit () {
    const previousState = localStorage.getItem('auth-state')
    const previousCodeVerifier = localStorage.getItem('code-verifier')

    const returnedData = new URLSearchParams(window.location.search)
    const returnedState = returnedData.get('state')
    const returnedCode = returnedData.get('code')

    if (
      returnedState &&
      returnedCode &&
      previousState &&
      previousCodeVerifier
    ) {
      if (returnedState != previousState) {
        //If state mismatch, stop the auth flow
        this._router.navigate(['']);
      } else {
        this.accessTokenService
          .getData(returnedCode, previousCodeVerifier)
          .subscribe({
            next: result => {
              console.log(result)
              localStorage.setItem('auth_object', JSON.stringify(result))
            },
            complete: () => {
              console.log('done');
              this._router.navigate(['']);
            }
          })
      }
    }
    else{
      //If fail then this page was reached on accident so redirect to home
      this._router.navigate(['']);
    }
  }
}