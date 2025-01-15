import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService extends Socket {
  constructor() {
    super({ url: 'http://url_one:portOne', options: {} });
  }

  connectSocket(message: string) {
    this.emit('connect', message);
  }

  disconnectSocket() {
    this.disconnect();
  }
}
