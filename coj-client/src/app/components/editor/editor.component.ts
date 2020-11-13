import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

declare const ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;

  public languages: string[] = ['C++', 'Java', 'Python'];

  language = 'Java';

  sessionId: string;

  output: string = '';

  DEFAULT_CONTENT = {
    'Java': `public class Example{
      public static void main(String[] args) {
          // Type your Java code here
      }
}`,
    'C++': `#include <iostream>
    using namespace std;
    ​
    int main() {
       // Type your C++ code here
       return 0;
}`,
    'Python': `class Solution:
        def example():
            # Write your Python code here`
  };

  MAP = {
    'Java': 'java',
    'C++': 'c_cpp',
    'Python': 'python'
  };

  constructor(@Inject('collaboration') private collaboration,
              @Inject('data') private data,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
      });
    this.initEditor();
  }

  initEditor(): void {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();
    this.editor.$blockScrolling = Infinity;

    document.getElementsByTagName('textarea')[0].focus();

    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    this.editor.on('change', e => {
      console.log('editor changes: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange !== e) {
        this.collaboration.change(JSON.stringify(e));
      }
    });

    this.editor.getSession().getSelection().on('changeCursor', () => {
      const cursor = this.editor.getSession().getSelection().getCursor();

      console.log('cursor moves: ' + JSON.stringify(cursor));

      this.collaboration.cursorMove(JSON.stringify(cursor));
    });

    this.collaboration.restoreBuffer();
  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void {
    this.editor.getSession().setMode('ace/mode/' + this.MAP[this.language]);
    this.editor.setValue(this.DEFAULT_CONTENT[this.language]);
    this.output = '';
  }

  submit(): void {
    const userCode = this.editor.getValue();
    const data = {
      user_code: userCode,
      lang: this.language.toLowerCase()
    };
    this.data.buildAndRun(data)
      .then( res => {
        this.output = res.text;
      });
    console.log(userCode);
  }
}
