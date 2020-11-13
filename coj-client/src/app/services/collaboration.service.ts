import { Injectable } from '@angular/core';
import { COLORS } from '../../assets/colors';

declare const io: any;
declare const ace: any;

@Injectable()
export class CollaborationService {

  collaborationSocket: any;

  clientInfo: Object = {};

  clientNum: number = 0;

  constructor() { }

  init(editor: any, sessionId: string): void {
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});

    this.collaborationSocket.on('change', (delta: string) => {
      console.log('collaboration: editor changed by ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });

    this.collaborationSocket.on('cursorMove', cursor => {
      console.log('cursor move: ' + cursor);
      const session = editor.getSession();
      cursor = JSON.parse(cursor);
      const x = cursor['row'];
      const y = cursor['column'];
      const changeClientId = cursor['socketId'];
      console.log(x + ' ' + y + ' ' + changeClientId);

      if (changeClientId in this.clientInfo) {
        session.removeMarker(this.clientInfo[changeClientId]['marker']);
      } else {
        this.clientInfo[changeClientId] = {};

        const css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = '.editor_cursor_' + changeClientId
          + ' { position: absolute; background: ' + COLORS[this.clientNum] + ';'
          + ' z-index: 100; width: 3px !important; }';

        document.body.appendChild(css);
        this.clientNum++;
      }

      const Range = ace.require('ace/range').Range;
      const newMarker = session.addMarker(new Range(x, y, x, y + 1), 'editor_cursor_' + changeClientId, true);
      this.clientInfo[changeClientId]['marker'] = newMarker;
    });

    // Test
    this.collaborationSocket.on('message', (message) => {
      console.log('received: ' + message);
    });
  }

  change(delta: string): void {
    this.collaborationSocket.emit('change', delta);
  }

  cursorMove(cursor: string): void {
    this.collaborationSocket.emit('cursorMove', cursor);
  }

  restoreBuffer(): void {
    this.collaborationSocket.emit('restoreBuffer');
  }

}
