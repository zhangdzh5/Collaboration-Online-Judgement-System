import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

  problems: Problem[] = [];

  subscriptionProblems: Subscription;

  subscriptionSearch: Subscription;

  searchTerm: string = '';

  constructor(@Inject('data') private data,
              @Inject('input') private input) { }

  ngOnInit() {
    this.getProblems();
    this.getSearchTerm();
  }

  getProblems(): void {
    this.subscriptionProblems = this.data.getProblems().subscribe(problems => this.problems = problems);
  }

  getSearchTerm(): void {
    this.subscriptionSearch = this.input.getInput()
      .subscribe(inputTerm => {
        this.searchTerm = inputTerm;
      });
  }

}
