import { Component } from '@angular/core'
import { HttpParams } from '@angular/common/http'
import * as shajs from 'sha.js'

function randomString (length: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = ''
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'spotify_auth'
  onAuthClick () {
    const generated_state: string = randomString(16)
    //Code Verifier: create random string. Hash it w/ SHA256 and convert to base 64. Make it URL safe; now it's base-64-url-encoded :)
    const codeVerifier: string = randomString(128)
    var codeVerifierHash = shajs('sha256')
      .update(codeVerifier)
      .digest()
      .toString('base64')
    const codeChallenge = codeVerifierHash
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    localStorage.setItem('auth-state', generated_state)
    localStorage.setItem('code-verifier', codeVerifier)

    //Authorization Link
    const baseURL: string = 'https://accounts.spotify.com/en/authorize?'
    const paramObject = {
      response_type: 'code',
      //TODO: replace this w/ your client_id from the spotify developer page
      client_id: 'b8cb3d288d8146488b1f8194a2aa030c',
      scope: 'user-read-private user-read-email',
      redirect_uri: 'http://localhost:4200/callback',
      state: generated_state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    }

    const paramString = new HttpParams({ fromObject: paramObject }).toString()
    const authLink = baseURL + paramString
    window.location.href = authLink
  }
}