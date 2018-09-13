import { Injectable, Inject, InjectionToken, EventEmitter } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

export interface NgFxDataChannelConfig {
  key: string;
  id: string;
  signalServer: string;
  announceServer: string;
  messageServer: string;
  debug?: boolean;
}

export const uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const createKey = function() {
  let text = '';
  const possible = 'ABCDEFGHJKMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz023456789';

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const NgFxDataChannelConfigService = new InjectionToken<NgFxDataChannelConfig>('NgFxDataChannelConfig');

@Injectable()
export class NgFxDataChannel {
  public config: NgFxDataChannelConfig;
  public signal: WebSocket; // signal
  public message: WebSocket; // messaging
  public announce: WebSocket; // announce
  public stun: any;
  public observer: Observable<any>;
  public channelObserver: Observer<any>;
  public store: any;
  public emitter: EventEmitter<any>;
  public messages: EventEmitter<any>;
  public connections: any;
  public local: RTCPeerConnection;
  public debug: boolean;
  public peerConnectionConfig: any;

  constructor(@Inject(NgFxDataChannelConfigService) private conf) {
    this.debug = conf.debug ? conf.debug : false;
    this.config = {
      key: conf && conf.key ? conf.key : createKey(),
      id: conf && conf.id ? conf.id : uuid(),
      signalServer: conf && conf.signalServer ? conf.signalServer : `ws://${location.host.split(':')[0]}:5555`,
      announceServer: conf && conf.announceServer ? conf.announceServer : `ws://${location.host.split(':')[0]}:5556`,
      messageServer: conf && conf.messageServer ? conf.messageServer : `ws://${location.host.split(':')[0]}:5557`
    };
    if (this.debug) {
      console.log('webrtc datachannel');
      console.warn('config:', this.config);
    }

    this.init();
  }

  init() {
    this.signal = new WebSocket(this.config.signalServer);
    this.announce = new WebSocket(this.config.announceServer);
    this.message = new WebSocket(this.config.messageServer);
    this.signal.onmessage = ev => this.onSignal(ev);
    this.announce.onmessage = ev => this.onAnnounce(ev);
    this.announce.addEventListener('open', () => {
      this.sendAnnounce();
    });
    this.message.onmessage = ev => this.onMessage(ev);

    this.stun = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    };

    this.peerConnectionConfig = {
      ordered: false
    };
    this.store = {
      messages: []
    };
    this.connections = {};

    this.emitter = new EventEmitter();
    this.messages = new EventEmitter();
    this.observer = new Observable(observer => (this.channelObserver = observer)).pipe(share());
    this.observer.subscribe();
  }

  connect(ev: any) {
    this.connections[ev.id] = {
      id: ev.id,
      key: ev.key,
      peerConnection: new RTCPeerConnection(this.stun)
    };
    this.connections[ev.id].channel = this.connections[ev.id].peerConnection.createDataChannel(ev.key, this.peerConnectionConfig);
    this.connections[ev.id].channel.onopen = this.onDataChannelOpen.bind(this);
    this.connections[ev.id].peerConnection.ondatachannel = this.onDataChannel.bind(this, ev.id);
    // this.connections[ev.id].peerConnection.onnegotiationneeded = this.sendOffer.bind(this, ev);
    this.connections[ev.id].peerConnection.oniceconnectionstatechange = this.onICEStateChange.bind(this, ev);
    this.connections[ev.id].peerConnection.onicecandidate = this.onICECandidate.bind(this);
    this.connections[ev.id].peerConnection.oniceconnectionstatechange = this.onICEChange.bind(this, ev.id);
    this.connections[ev.id].peerConnection.onicegatheringstatechange = this.onICEGatheringStateChangeEvent;

    if (this.debug) {
      console.warn('new peer', this.connections[ev.id]);
    }
  }

  sendSignal(ev: any, data: any) {
    if (!data) {
      return;
    }
    ev.id = this.config.id;
    ev.data = data;
    if (this.debug) {
      console.log('sending signal:', ev);
    }
    this.signal.send(JSON.stringify(ev));
  }

  sendAnnounce() {
    const msg = {
      key: this.config.key,
      id: this.config.id,
      method: !RTCPeerConnection ? 'socket' : 'webrtc'
    };

    if (this.debug) {
      console.log('announced our shared key is ' + this.config.key);
      console.log('announced our id is ' + this.config.id);
    }

    this.announce.send(JSON.stringify(msg));
  }

  onAnnounce(msg: MessageEvent) {
    const ev = JSON.parse(msg.data);
    console.log('announce:', msg);
    if (!this.connections[ev.id]) {
      this.connect(ev);
      this.sendOffer(ev);
    }
  }

  onSignal(msg: MessageEvent) {
    const ev = JSON.parse(msg.data);
    if (this.debug) {
      console.log('signal:', ev);
    }
    if (ev.data === 'null') {
      if (this.debug) {
        console.log('all candidates received');
      }
      return;
    }

    if (ev.data.type === 'offer') {
      this.onOffer(ev, ev.data);
    } else if (ev.data.type === 'answer') {
      this.onAnswer(ev, ev.data);
    } else if (ev.data) {
      this.onCandidate(ev, JSON.parse(ev.data));
    }
  }

  sendOffer(ev: any) {
    console.warn('creating offer');
    (async () => {
      const offer = this.connections[ev.id].peerConnection.createOffer();
      offer.catch(err => console.error('error creating offer', err));
      this.connections[ev.id].peerConnection.setLocalDescription(await offer);
      this.sendSignal(ev, await offer);
    })();
  }

  onOffer(ev: any, offer: any) {
    this.connect(ev);
    this.connections[ev.id].hasOffer = true;
    if (this.debug) {
      console.warn('received offer', ev, new RTCSessionDescription(offer));
    }
    this.sendAnswer(ev, offer);
  }

  sendAnswer(ev: any, offer: any) {
    console.warn('creating answer');

    (async () => {
      const sessionDescription = new RTCSessionDescription(offer);
      this.connections[ev.id].peerConnection.setRemoteDescription(sessionDescription);
      const answer = this.connections[ev.id].peerConnection.createAnswer();
      answer.catch(err => console.error('error creating answer', err));
      this.connections[ev.id].peerConnection.setLocalDescription(await answer);
      this.sendSignal(ev, await answer);
    })();
  }

  onAnswer(ev: any, answer: any) {
    this.connections[ev.id].hasAnswer = true;
    if (this.debug) {
      console.warn('received answer', ev, new RTCSessionDescription(answer));
    }
    const sessionDescription = new RTCSessionDescription(answer);
    this.connections[ev.id].peerConnection.setRemoteDescription(sessionDescription);
  }

  onCandidate(ev: any, candid: any) {
    // console.warn('candidate:', ev, candid);
    const candidate = new (<any>window).RTCIceCandidate(candid);
    this.connections[ev.id].peerConnection.addIceCandidate(candidate);
  }

  onICEGatheringStateChangeEvent(ev: any) {
    // console.log(ev);
  }

  onICEChange(id: string, ev: any) {
    if (this.debug) {
      console.log(`${id} ice ${ev.target.iceConnectionState}`);
    }
  }

  onICEStateChange(ev: any) {
    console.log('ice state:', this.connections[ev.id].peerConnection.iceConnectionState);
    if (this.connections[ev.id].peerConnection.iceConnectionState === 'disconnected') {
      if (this.debug) {
        console.log('client disconnected!');
      }
    }
  }

  onICECandidate(ev) {
    const candidate = JSON.stringify(ev.candidate);
    if (!candidate) {
      if (this.debug) {
        console.warn('all candidates sent');
      }
      return;
    }
    const event = {
      id: this.config.id
    };
    if (candidate) {
      if (this.debug) {
        console.log('sending candidate:', event, candidate);
      }
      this.sendSignal(event, candidate);
    } else {
      if (this.debug) {
        console.log('all candidates sent');
      }
    }
  }

  onDataChannel(id: string, ev: any) {
    // RTCDataChannelEvent
    ev.channel.onmessage = this.onMessage.bind(this);
    if (this.debug) {
      console.error('data channel open!');
    }
  }

  onDataChannelOpen(id: string, ev: any) {
    if (this.debug) {
      console.error('data channel created!');
      this.emitter.emit('open');
    }
  }

  onMessage(msg: MessageEvent) {
    if (this.debug) {
      console.log('message: ', msg);
    }
    const ev = JSON.parse(msg.data);
    ev.data = JSON.parse(ev.data);
    this.store.messages.push(ev);
    this.messages.emit(this.store.messages[this.store.messages.length - 1]);
    this.channelObserver.next(this.store.messages);
  }

  send(data: any) {
    const msg = JSON.stringify({
      type: 'message',
      id: this.config.id,
      sender: this.config.id,
      timestamp: new Date(),
      data: JSON.stringify(data)
    });

    if (Object.keys(this.connections).length > 0) {
      if (this.debug) {
        console.log('sending: ', msg);
      }
      for (const prop in this.connections) {
        if (this.connections[prop] && this.connections[prop].channel) {
          if (this.debug) {
            console.log('sending message to: ', prop);
          }
          this.connections[prop].channel.send(msg);
        }
      }
    }
  }
}
