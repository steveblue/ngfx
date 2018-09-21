import { Injectable, Inject, InjectionToken, EventEmitter } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

export interface NgFxDataChannelConfig {
  key: string;
  id: string;
  signalServer: string;
  announceServer: string;
  messageServer: string;
  stun?: RTCConfiguration;
  debug?: boolean;
}

export interface NgFxDataChannelMessage {
  sender?: string;
  id: string;
  key?: string;
  type?: string;
  timestamp?: Date;
  data?: any;
}

export interface NgFxDataChannelPeer {
  peerConnection: RTCPeerConnection;
  id: string;
  key: string;
  hasOffer?: boolean;
  hasAnswer?: boolean;
  channel?: RTCDataChannel;
}

export interface NgFxDataChannelPeerMap {
  [key: string]: NgFxDataChannelPeer;
}

export interface NgFxDataChannelStore {
  messages: NgFxDataChannelMessage[];
}

export interface NgFxDataChannelEvent {
  type: string;
  payload: any;
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
  public stun: RTCConfiguration;
  public observer: Observable<any>;
  public channelObserver: Observer<any>;
  public store: NgFxDataChannelStore;
  public emitter: EventEmitter<NgFxDataChannelEvent>;
  public messages: EventEmitter<NgFxDataChannelMessage>;
  public connections: NgFxDataChannelPeerMap;
  public local: RTCPeerConnection;
  public debug;
  private _pulseInterval: number;

  constructor(@Inject(NgFxDataChannelConfigService) private conf) {
    this.debug = conf.debug ? conf.debug : false;
    this.config = {
      key: conf && conf.key ? conf.key : createKey(),
      id: conf && conf.id ? conf.id : uuid(),
      signalServer: conf && conf.signalServer ? conf.signalServer : `wss://${location.host.split(':')[0]}:5555`,
      announceServer: conf && conf.announceServer ? conf.announceServer : `wss://${location.host.split(':')[0]}:5556`,
      messageServer: conf && conf.messageServer ? conf.messageServer : `wss://${location.host.split(':')[0]}:5557`,
      stun: conf
        ? conf
        : {
            iceServers: [
              {
                urls: 'stun:stun.l.google.com:19302'
              }
            ]
          }
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
      this.sendPulse();
    });
    this.message.onmessage = ev => this.onMessage(ev);
    this.store = {
      messages: []
    };
    this.connections = {};
    this.emitter = new EventEmitter();
    this.messages = new EventEmitter();
    this.observer = new Observable(observer => (this.channelObserver = observer)).pipe(share());
    this.observer.subscribe();
  }

  connect(ev: NgFxDataChannelMessage) {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    this.connections[ev.id] = {
      id: ev.id,
      key: ev.key,
      peerConnection: new RTCPeerConnection(this.config.stun)
    };
    this.connections[ev.id].channel = this.connections[ev.id].peerConnection.createDataChannel(ev.key, {
      ordered: false
    }); // TODO: see if there is a need to make the datachannel config public
    this.connections[ev.id].channel.onopen = this.onDataChannelOpen.bind(this, { id: ev.id, key: ev.key });
    if (isSafari) {
      // TODO: check for version as well. call to navigator.getUserMedia is required even for data channel in safari
      navigator.getUserMedia(
        { audio: false, video: { width: 1280, height: 720 } },
        stream => {},
        err => {
          console.log('error: ' + err.name);
        }
      );
    }
    this.connections[ev.id].peerConnection.ondatachannel = this.onDataChannel.bind(this, ev.id);
    this.connections[ev.id].peerConnection.oniceconnectionstatechange = this.onICEStateChange.bind(this, ev);
    this.connections[ev.id].peerConnection.onicecandidate = this.onICECandidate.bind(this);
    this.connections[ev.id].peerConnection.oniceconnectionstatechange = this.onICEChange.bind(this, ev.id);

    if (this.debug) {
      console.warn('new peer', this.connections[ev.id]);
    }
  }

  isRTCSupported() {
    if (typeof RTCPeerConnection == 'undefined') {
      return false;
    } else {
      return true;
    }
  }

  sendSignal(ev: NgFxDataChannelMessage, data: any) {
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

  sendPulse() {
    this._pulseInterval = window.setInterval(() => {
      if (Object.keys(this.connections).length <= 0) {
        if (this.debug) {
          console.log('sending pulse');
        }
        this.sendAnnounce();
      }
    }, 2500);
  }

  checkForPeers() {
    if (Object.keys(this.connections).length === 0) {
      this.sendPulse();
    }
  }

  sendAnnounce() {
    if (Object.keys(this.connections).length > 0 && this._pulseInterval) {
      window.clearInterval(this._pulseInterval);
    }
    const msg = {
      key: this.config.key,
      id: this.config.id,
      method: !RTCPeerConnection ? 'socket' : 'webrtc'
    };

    if (this.debug) {
      console.log('announced our shared key is ' + this.config.key);
      console.log('announced our id is ' + this.config.id);
    }

    if (!this.isRTCSupported()) {
      console.warn('client is attempting to connect but this client does not support RTCPeerConnection');
      this.emitter.emit({
        type: 'error',
        payload: {
          message: 'client is attempting to connect but this client does not support RTCPeerConnection'
        }
      });
    }
    this.announce.send(JSON.stringify(msg));
  }

  onAnnounce(msg: MessageEvent) {
    const ev = JSON.parse(msg.data);
    if (this.debug) {
      console.log('announce:', msg);
    }
    if (!this.connections[ev.id] && this.isRTCSupported()) {
      this.connect(ev);
      this.sendOffer(ev);
    } else {
      // TODO: add fallback for websockets?
      this.emitter.emit({
        type: 'error',
        payload: {
          message: 'client is attempting to connect but this client does not support RTCPeerConnection'
        }
      });
      console.warn('client is attempting to connect but this client does not support RTCPeerConnection');
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

  sendOffer(ev: NgFxDataChannelMessage) {
    if (this.debug) {
      console.warn('creating offer');
    }
    (async () => {
      const offer = this.connections[ev.id].peerConnection.createOffer();
      offer.catch(err => console.error('error creating offer', err));
      const newOffer = await offer;
      this.connections[ev.id].peerConnection.setLocalDescription(newOffer);
      this.sendSignal(ev, newOffer);
    })();
  }

  onOffer(ev: NgFxDataChannelMessage, offer: RTCSessionDescription) {
    this.connect(ev);
    this.connections[ev.id].hasOffer = true;
    if (this.debug) {
      console.warn('received offer', ev, new RTCSessionDescription(offer));
    }
    this.sendAnswer(ev, offer);
  }

  sendAnswer(ev: NgFxDataChannelMessage, offer: RTCSessionDescription) {
    if (this.debug) {
      console.warn('creating answer');
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    (async () => {
      const sessionDescription = new RTCSessionDescription(offer);
      this.connections[ev.id].peerConnection.setRemoteDescription(sessionDescription);
      if (isSafari) {
        // TODO: check for version as well. call to navigator.getUserMedia is required even for data channel
        navigator.getUserMedia(
          { audio: false, video: { width: 1280, height: 720 } },
          stream => {},
          err => {
            console.log('error: ' + err.name);
          }
        );
      }
      const answer = this.connections[ev.id].peerConnection.createAnswer();
      answer.catch(err => console.error('error creating answer', err));
      const newAnswer = await answer;
      this.connections[ev.id].peerConnection.setLocalDescription(newAnswer);
      this.sendSignal(ev, newAnswer);
    })();
  }

  onAnswer(ev: NgFxDataChannelMessage, answer: any) {
    this.connections[ev.id].hasAnswer = true;
    if (this.debug) {
      console.warn('received answer', ev, new RTCSessionDescription(answer));
    }
    const sessionDescription = new RTCSessionDescription(answer);
    this.connections[ev.id].peerConnection.setRemoteDescription(sessionDescription);
  }

  onCandidate(ev: NgFxDataChannelMessage, candid: RTCIceCandidateInit | RTCIceCandidate) {
    // console.warn('candidate:', ev, candid);
    const candidate = new (<any>window).RTCIceCandidate(candid);
    this.connections[ev.id].peerConnection.addIceCandidate(candidate);
  }

  onICEChange(id: string, ev: any) {
    // console.warn('ice change:', id, ev);
    if (this.debug) {
      console.log(`${id} ice ${ev.target.iceConnectionState}`, ev);
    }
    if (ev.target.iceConnectionState === 'disconnected' || ev.target.iceConnectionState === 'failed') {
      delete this.connections[id];
      this.checkForPeers();
    }
  }

  onICEStateChange(ev: NgFxDataChannelPeer) {
    if (this.debug) {
      console.log('ice state:', this.connections[ev.id].peerConnection.iceConnectionState);
    }
    if (this.connections[ev.id].peerConnection.iceConnectionState === 'disconnected') {
      if (this.debug) {
        console.log('client disconnected!');
      }
    }
  }

  onICECandidate(ev: RTCIceCandidate) {
    const candidate = JSON.stringify(ev.candidate);
    if (!candidate) {
      if (this.debug) {
        console.warn('all candidates sent');
      }
      return;
    }
    const evt = {
      id: this.config.id
    };
    if (candidate) {
      if (this.debug) {
        console.log('sending candidate:', evt, candidate);
      }
      this.sendSignal(evt, candidate);
    } else {
      if (this.debug) {
        console.log('all candidates sent');
      }
    }
  }

  onDataChannel(id: string, ev: RTCDataChannelEvent) {
    // RTCDataChannelEvent
    ev.channel.onmessage = this.onMessage.bind(this);
    if (this.debug) {
      console.error('data channel open!');
    }
  }

  onDataChannelOpen(ev: any) {
    if (this.debug) {
      console.error('data channel created!', ev);
    }
    this.emitter.emit({
      type: 'open',
      payload: {
        id: ev.id,
        key: ev.key
      }
    });
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
