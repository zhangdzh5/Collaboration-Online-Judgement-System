import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  title = 'COJ';

  username = '';

  searchBox: FormControl = new FormControl();

  subscription: Subscription;

  constructor(@Inject('auth') private auth,
              @Inject('input') private input,
              private route: Router) {
  }

  ngOnInit() {

    if (this.auth.Authenticated()) {
      console.log('logged in');
      this.username = this.auth.getProfile().nickname;
    }

    this.subscription = this.searchBox.valueChanges
      .debounceTime(200)
      .subscribe( term => {
      this.input.changeInput(term);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchProblem(): void {
    this.route.navigate(['/problems']);
  }

  login(): void {
    this.auth.login()
      .then(profile => {
        this.username = profile.nickname;
      })
      .catch();
  }

  logout(): void {
    this.auth.logout();
  }

}
