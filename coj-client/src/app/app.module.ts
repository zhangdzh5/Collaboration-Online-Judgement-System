import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from './app.routes';

import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditorComponent } from './components/editor/editor.component';

import { DataService } from './services/data.service';
import { AuthService} from './services/auth.service';
import { AuthGuardService} from './services/auth-guard.service';
import { CollaborationService } from './services/collaboration.service';
import { InputService } from './services/input.service';

import { SearchPipe } from './pipe/search.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NewProblemComponent,
    NavigationComponent,
    ProfileComponent,
    EditorComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [{
    provide: 'data',
    useClass: DataService
  }, {
    provide: 'auth',
    useClass: AuthService
  }, {
    provide: 'authGuard',
    useClass: AuthGuardService
  }, {
    provide: 'collaboration',
    useClass: CollaborationService
  }, {
    provide: 'input',
    useClass: InputService
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
