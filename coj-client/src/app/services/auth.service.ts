import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';


declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  clientID = 'TsGud5Rfpz24HuVJ_SOlU2KnYqlAWbf0';
  domain = 'jason-coj.auth0.com';
  lock = new Auth0Lock(this.clientID, this.domain, {});

  constructor(private http: Http) {}

  public login(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.lock.show((error: string, profile: Object, id_token: string) => {
        if (error) {
          reject(error);
        } else {
          localStorage.setItem('profile', JSON.stringify(profile));
          localStorage.setItem('id_token', id_token);
          resolve(profile);
        }
      });
    });
  }

  public logout(): void {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
  }

  public Authenticated(): boolean {

    return tokenNotExpired('id_token');
  }

  public getProfile(): any {
    return JSON.parse(localStorage.getItem('profile'));
  }

  public resetPassword(): void {
    const profile = this.getProfile();
    const url = `https://${this.domain}/dbconnections/change_password`;
    const headers = new Headers({'content-type': 'application/json'});
    const body = {
          client_id: this.clientID,
          email: profile.email,
          connection: 'Username-Password-Authentication'
        };
    this.http.post(url, body, {headers: headers})
      .toPromise()
      .then((res: Response) => {
        console.log(res.json());
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.body || error);
  }
}
