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
  public id: string;
  public key: string;
  public name: string;
  public peerConnectionConfig: any;
  public db: any;
  public ws: WebSocket; // signal
  public wss: WebSocket; // messaging
  public announce: WebSocket; // announce
  public url: string;
  public stun: any;
  public remotePeer: any;
  public observer: Observable<any>;
  public channelObserver: Observer<any>;
  public peerConnection: any;
  public hasPulse: boolean;
  public isOpen: boolean;
  public hasWSConnection: boolean;
  public hasRTCConnection: boolean;
  public channel: any;
  // public channels: any;
  public dataChannel: any;
  public emitter: EventEmitter<any>;
  public messages: EventEmitter<any>;
  public connections: any;
  public websocketConnections: any;
  public debug: boolean;
  public isWebSocket: boolean;
  public count: number;
  public store: {
    messages: any;
  };

  constructor(@Inject(NgFxDataChannelConfigService) private config) {
    this.config = config
      ? config
      : {
          key: createKey(),
          id: uuid(),
          signalServer: `ws://${location.host.split(':')[0]}:5555`,
          announceServer: `ws://${location.host.split(':')[0]}:5556`,
          messageServer: `ws://${location.host.split(':')[0]}:5557`
        };

    this.id = this.config.id || uuid(); // unique id that makes each peer => make uuid?
    this.key = this.config.key || createKey(); // the room name.
    this.url = this.config.signalServer; // replace with your server name

    this.ws = new WebSocket(this.config.signalServer);
    this.announce = new WebSocket(this.config.announceServer);
    this.wss = new WebSocket(this.config.messageServer);
    this.count = 0;
    this.hasPulse = false;
    this.isOpen = false;
    this.hasWSConnection = false;
    this.hasRTCConnection = false;
    this.connections = {};
    this.websocketConnections = {};

    this.isWebSocket = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'] ? true : false;
    this.debug = config && config.debug ? config.debug : false;

    this.store = { messages: [] };

    this.stun = {
      iceServers: [
        {
          url: 'stun:stun.l.google.com:19302'
        }
      ]
    };

    this.peerConnectionConfig = {
      ordered: false
    };

    this.ws.onmessage = msg => this.onSignal(msg);
    this.announce.onmessage = msg => this.onAnnounce(msg);

    this.emitter = new EventEmitter();
    this.messages = new EventEmitter();
    this.observer = new Observable(observer => (this.channelObserver = observer)).pipe(share());
    this.observer.subscribe();
  }

  sendAnnounce() {
    const RTCPeerConnection =
      (<any>window).RTCPeerConnection || (<any>window).mozRTCPeerConnection || (<any>window).webkitRTCPeerConnection;

    const msg = {
      sharedKey: this.key,
      id: this.id,
      method: !RTCPeerConnection ? 'socket' : 'webrtc'
    };

    if (!RTCPeerConnection) {
      this.isWebSocket = true;
    }

    this.announce.send(JSON.stringify(msg));

    if (this.debug) {
      console.log('announced our shared key is ' + this.key);
      console.log('announced our id is ' + this.id);
    }
  }

  onAnnounce(snapshot) {
    const msg = JSON.parse(snapshot.data);

    if (msg.id !== this.id && msg.sharedKey === this.key) {
      if (this.debug) {
        console.log('discovered matching ' + msg.method + ' announcement from ' + msg.id);
      }

      if (msg.method !== 'socket') {
        this.connections[msg.id] = {
          id: msg.id,
          isConnected: false,
          isWebRTC: true
        };
      }

      if (msg.method === 'socket') {
        this.connections[msg.id] = {
          id: msg.id,
          isConnected: false,
          isWebSocket: true
        };
      }

      if (msg.method === 'webrtc') {
        this.init(msg);
        this.connections[msg.id].peerConnection.onicecandidate = this.onICECandidate.bind(this);
        this.connections[msg.id].peerConnection
          .createOffer()
          .then(offer => {
            this.connections[msg.id].peerConnection.setLocalDescription(offer);
            if (this.debug) {
              console.warn('sending offer');
            }
            this.sendSignal(offer.toJSON());
          })
          .catch(err => {
            console.error('Could not create offer', err);
          });
      } else {
        this.sendSignal({
          id: this.id,
          key: this.key,
          url: this.url,
          type: 'ws-offer'
        });
        if (!this.isOpen) {
          this.addWSPeer(msg);
          this.initSocket(msg);
        }
      }
    }
  }

  sendSignal(msg) {
    msg.sender = this.id;
    if (Object.keys(this.connections).length > 0) {
      for (const prop of Object.keys(this.connections)) {
        if (this.connections[prop].isWebSocket) {
          this.addWSPeer(this.connections[prop]);
          this.initSocket(this.connections[prop]);
        }
        this.ws.send(JSON.stringify(msg));
        if (this.debug) {
          console.log('sending offer from ' + this.id + ' to ' + this.connections[prop].id);
        }
      }
    }
  }

  onOffer(msg) {
    if (this.connections[msg.id].isNegotiating) {
      return;
    }

    const RTCSessionDescription = (<any>window).RTCSessionDescription || (<any>window).mozRTCSessionDescription;
    this.connections[msg.id].hasPulse = true;

    if (this.debug) {
      console.warn('receiving offer', msg.id, this.connections[msg.id]);
      console.log('client has pulse');
    }

    this.connections[msg.id].isNegotiating = true;

    if (RTCSessionDescription) {
      this.connections[msg.id].peerConnection
        .setRemoteDescription(new RTCSessionDescription(msg))
        .then(() => this.connections[msg.id].peerConnection.createAnswer())
        .then(answer => {
          if (this.debug) {
            console.warn('sending answer signal ', answer.toJSON());
          }
          this.connections[msg.id].peerConnection.setLocalDescription(answer);
          this.sendSignal(answer.toJSON());
        })
        .catch(err => {
          if (this.debug) {
            console.error('could not create offer', err);
          }
        });
    }
  }

  onAnswerSignal(msg) {
    const RTCSessionDescription = (<any>window).RTCSessionDescription || (<any>window).mozRTCSessionDescription;
    if (RTCSessionDescription && this.connections[msg.id].peerConnection.signalingState !== 'stable') {
      if (this.debug) {
        console.warn('handling answer from ', msg.id, this.connections[msg.id].peerConnection);
      }

      this.connections[msg.id].peerConnection.onicecandidate = this.onICECandidate.bind(this);
      this.connections[msg.id].peerConnection.setRemoteDescription(new RTCSessionDescription(msg)).then(() => {
        if (this.debug) {
          console.warn('sending offer');
        }
        this.sendSignal(msg);
      });
    }
  }

  onCandidateSignal(msg) {
    const candidate = new (<any>window).RTCIceCandidate(msg);
    if (this.connections[msg.id].isCandidate !== true) {
      if (this.debug) {
        console.warn('adding candidate to peerConnection: ' + msg.sender);
      }
      this.connections[msg.id].isCandidate = true;
      this.connections[msg.id].peerConnection.addIceCandidate(candidate);
    }
  }

  onSignal(snapshot) {
    const msg = JSON.parse(snapshot.data);

    if (msg.sender && msg.id === undefined) {
      msg.id = msg.sender;
    }

    if (!this.connections[msg.id]) {
      this.connections[msg.id] = {
        id: msg.id,
        isConnected: false,
        isWebRTC: msg.type === 'ws-offer' ? false : true,
        isWebSocket: msg.type === 'ws-offer' ? true : false
      };
      this.init(msg);
    }

    if (this.connections[msg.id].isConnected) {
      return;
    }

    if (this.debug) {
      console.log("Received a '" + msg.type + "' signal from " + msg.id + ' of type ' + msg.type);
    }
    if (msg.type === 'message') {
      this.onWebSocketMessage(msg);
    }
    if (msg.type === 'ws-offer') {
      if (!this.hasWSConnection) {
        this.addWSPeer(msg);
        this.initSocket(msg);
      }
    }
    if (msg.type === 'offer') {
      this.onOffer(msg);
    }
    if (msg.type === 'answer') {
      this.onAnswerSignal(msg);
    }
    if (msg.type === 'candidate') {
      this.onCandidateSignal(msg);
    }
  }

  sendCandidates(msg) {
    this.connections[msg.id].peerConnection.onicecandidate = this.onICECandidate.bind(this);
  }

  onICEStateChange(msg) {
    if (!this.connections[msg.id]) {
      this.connections[msg.id] = {
        id: msg.id,
        isConnected: false,
        isWebRTC: true,
        isWebSocket: false
      };
      this.init(msg);
    }

    if (this.connections[msg.id].peerConnection.iceConnectionState === 'disconnected') {
      Object.keys(this.connections).filter((key: string) => {
        if (!this.connections[key].isConnected) {
          delete this.connections[key];
        }
      });
      if (this.debug) {
        console.log('client disconnected!');
      }
    }
  }

  onICECandidate(ev) {
    let candidate = ev.candidate;
    if (candidate) {
      candidate = candidate.toJSON();
      candidate.type = 'candidate';
      if (this.debug) {
        console.log('sending candidate');
      }
      this.sendSignal(candidate);
    } else {
      if (this.debug) {
        console.log('all candidates sent');
      }
    }
  }

  onDataChannel(ev) {
    ev.channel.onmessage = this.onDataChannelMessage.bind(this);
  }

  onDataChannelOpen(ev, msg) {
    if (ev.id) {
      this.isOpen = true;
      this.connections[ev.id].isConnected = true;
      this.connections[ev.id].isNegotiating = false;
      this.emitter.emit('open');
    }
    if (this.debug) {
      console.log('data channel created!', this.connections[ev.id]);
    }
  }

  onDataChannelClosed() {
    if (this.debug) {
      console.log('data channel closed!');
    }
  }

  onDataChannelMessage(ev) {
    if (this.debug) {
      console.log('received Message: ', {
        id: this.count++,
        data: JSON.parse(ev.data),
        sender: JSON.parse(ev.data).sender,
        createdAt: new Date()
      });
    }
    this.store.messages.push(JSON.parse(ev.data));
    this.messages.emit(this.store.messages[this.store.messages.length - 1]);
    this.channelObserver.next(this.store.messages);
  }

  onWebSocketMessage(ev) {
    if (this.debug) {
      console.log('received message: ', {
        id: this.count++,
        data: JSON.parse(ev.data),
        sender: JSON.parse(ev.data).sender,
        createdAt: new Date()
      });
    }
    this.store.messages.push(JSON.parse(ev.data));
    this.messages.emit(this.store.messages[this.store.messages.length - 1]);
    this.channelObserver.next(this.store.messages);
  }

  onWebSocketSignal(snapshot) {
    let msg = JSON.parse(snapshot.data);

    if (msg.constructor.name === 'String') {
      msg = JSON.parse(msg);
    }

    if (this.debug) {
      console.log("received a '" + msg.type + "' signal from " + msg.sender + ' of type ' + msg.type);
    }

    if (msg.type === 'message') {
      this.onWebSocketMessage(msg);
    }

    if (msg.type === 'ws-offer') {
      this.addWSPeer(msg);
      this.initSocket(msg);
    }
  }

  send(data: any) {
    const msg = JSON.stringify({
      type: 'message',
      sender: this.id,
      data: data
    });

    if (this.debug) {
      console.log('sending message: ', JSON.parse(JSON.stringify(msg, null, 4)));
    }

    if (Object.keys(this.connections).length > 0) {
      for (const prop in this.connections) {
        if (this.connections[prop].channel.readyState === 'open') {
          this.connections[prop].channel.send(msg);
        }
      }
    }

    if (Object.keys(this.websocketConnections).length > 0) {
      this.sendSocketMessage(data);
    }
  }

  sendSocketMessage(data: any) {
    const msg = JSON.stringify({
      type: 'message',
      sender: this.id,
      data: data
    });

    for (const prop in this.connections) {
      if (this.connections[prop].isWebSocket) {
        if (this.debug) {
          console.log('Sending WebSocket message from: ' + this.id + ' to: ' + this.websocketConnections[prop].id, data);
        }
        // send a message to all recipients
        this.wss.send(JSON.stringify(msg));
        // this.db.child('messages').child( this.websocketConnections[prop].id ).push(msg);
      }
    }
  }

  createWebSocketChannel() {
    return {
      send: this.sendSocketMessage.bind(this)
    };
  }

  init(msg) {
    const RTCPeerConnection =
      (<any>window).RTCPeerConnection || (<any>window).mozRTCPeerConnection || (<any>window).webkitRTCPeerConnection;

    if (this.debug) {
      console.log('setting up webrtc peer connection');
    }

    if (!this.connections[msg.id]) {
      this.connections[msg.id] = {
        id: msg.id,
        isConnected: false,
        isWebRTC: true
      };
    }

    this.connections[msg.id].peerConnection = new RTCPeerConnection(this.stun);
    this.connections[msg.id].peerConnection.ondatachannel = this.onDataChannel.bind(this);
    this.connections[msg.id].peerConnection.oniceconnectionstatechange = this.onICEStateChange.bind(this, msg);

    this.connections[msg.id].channel = this.connections[msg.id].peerConnection.createDataChannel(this.key, this.peerConnectionConfig);
    this.connections[msg.id].channel.onopen = this.onDataChannelOpen.bind(this, msg);
    this.connections[msg.id].channel.onmessage = this.onDataChannelMessage.bind(this, [msg]);
    this.hasRTCConnection = true;
  }

  addWSPeer(msg) {
    if (!this.connections[msg.id]) {
      this.connections[msg.id] = {
        id: msg.id,
        isConnected: true,
        isWebSocket: true
      };
    }
    if (this.debug) {
      console.log('setting up websocket connection with ' + this.websocketConnections[msg.id].id);
    }
  }

  initSocket(msg: any) {
    if (!this.hasWSConnection) {
      this.isOpen = true;
      this.hasWSConnection = true;

      this.connections[msg.id].channel = this.createWebSocketChannel();
      this.wss.onmessage = message => this.onWebSocketSignal(message);

      this.hasWSConnection = true;
      this.connections[msg.id] = true;
      this.emitter.emit('open');

      if (this.debug) {
        console.log('Client has pulse');
      }
    }
  }
}
