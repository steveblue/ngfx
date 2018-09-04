import { Injectable, Inject, InjectionToken, EventEmitter } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

export interface NgFxDataChannelConfig {
        key: string
        id: string
        signalServer: string
        announceServer: string
        messageServer: string,
        debug?: boolean
}

export const uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const createKey = function () {
  let text = '';
  let possible = 'ABCDEFGHJKMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz023456789';

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
    messages: any
  };

  constructor(@Inject(NgFxDataChannelConfigService) private config) {

    //let self = this;

    // firebase.initializeApp(FirebaseConfig);

    this.config = config ? config : {
        key: createKey(),
        id: uuid(),
        signalServer: `ws://${location.host.split(':')[0]}:5555`,
        announceServer: `ws://${location.host.split(':')[0]}:5556`,
        messageServer: `ws://${location.host.split(':')[0]}:5557`
    };

    this.id = this.config.id || uuid(); // unique id that makes each peer => make uuid?
    this.key = this.config.key || createKey(); // the room name.
    this.url = this.config.signalServer; // replace with your server name
    this.name = 'channel'; // the name of the channel
    // this.db = firebase.database().ref(); //new Firebase(this.url); // only supports Firebase for now, support for custom web socket server in the future.
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

    this.isWebSocket = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream']) ? true : false;
    this.debug = config && config.debug ? config.debug : false;


    this.store = { messages: [] };

    this.stun = {
      iceServers: [{
        url: 'stun:stun.l.google.com:19302'
      }]
    };

    this.peerConnectionConfig = {
      ordered: false
    };


    // this.channels = {
    //   announce: this.db.child('announce'),
    //   signal: this.db.child('messages').child(this.id)
    // };

    this.ws.onmessage = (msg) => this.onSignal(msg);
    this.announce.onmessage = (msg) => this.onAnnounce(msg);

    // this.channels.signal.on('child_added', this.onSignal.bind(self));
    // this.channels.announce.on('child_added', this.onAnnounce.bind(self));

    this.emitter = new EventEmitter();
    this.messages = new EventEmitter();
    this.observer = new Observable(observer => this.channelObserver = observer).pipe(share());

    //this.ws.onopen = (msg) => { this.sendSignal(msg.data) };
    this.announce.onopen = this.sendAnnounce.bind(this);
    // this.sendAnnounce();

  }

  sendAnnounce() {

    let RTCPeerConnection = (<any>window).RTCPeerConnection || (<any>window).mozRTCPeerConnection ||
      (<any>window).webkitRTCPeerConnection;
    let msg = {
      sharedKey: this.key,
      id: this.id,
      method: !RTCPeerConnection ? 'socket' : 'webrtc'
    };

    if (!RTCPeerConnection) {
      this.isWebSocket = true;
    }

    this.announce.send(JSON.stringify(msg));

    if (this.debug) {
      console.log('Announced our sharedKey is ' + this.key);
    }
    if (this.debug) {
      console.log('Announced our ID is ' + this.id);
    }

    // this.channels.announce.remove(() => {
    //   this.channels.announce.push(msg);
    //   if (this.debug) {
    //     console.log('Announced our sharedKey is ' + this.room);
    //   }
    //   if (this.debug) {
    //     console.log('Announced our ID is ' + this.id);
    //   }

    // });

  }

  onAnnounce(snapshot) {

    let msg = JSON.parse(snapshot.data);

    if (msg.id !== this.id && msg.sharedKey === this.key) {

      if (this.debug) {
        console.log('Discovered matching ' + msg.method + ' announcement from ' + msg.id);
      }

      if (msg.method !== 'socket') {
        this.connections[msg.id] = {
          id: msg.id,
          isConnected: false
        };
      }

      if (msg.method === 'socket') {
        this.websocketConnections[msg.id] = {
          id: msg.id,
          isConnected: false
        };
      }



      if (msg.method === 'webrtc') {
        this.init();
        this.connect();
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

    if (msg.type !== 'ws-offer') {
      for (let prop in this.connections) {
        if (this.connections[prop].isConnected === false) {
          // send message to all recipients
          this.ws.send(JSON.stringify(msg));
          // this.db.child('messages').child(this.connections[prop].id).push(msg);

          if (this.debug) {
            console.log('Sending offer from ' + this.id + ' to ' + this.connections[prop].id);
          }
        }
      }
    } else {

      for (let pr in this.websocketConnections) {
        if (this.websocketConnections[pr].isConnected === false) {

          // send message to all recipients
          this.ws.send(JSON.stringify(msg));
          // this.db.child('messages').child(this.websocketConnections[pr].id).push(msg);


          if (this.debug) {
            console.log('Sending ws-offer from ' + this.id + ' to ' + this.websocketConnections[pr].id);
          }

          if (!this.hasWSConnection) { // TODO: figure out why signaling is broken here

            this.addWSPeer({ id: this.websocketConnections[pr].id });
            this.initSocket({ id: this.websocketConnections[pr].id });

          }

        }
      }
    }

  }

  onOffer(msg) {

    let RTCSessionDescription = (<any>window).RTCSessionDescription || (<any>window).mozRTCSessionDescription;
    this.hasPulse = true;
    if (this.debug) {
      console.log('Client has pulse');
    }

    this.connections[msg.sender] = {
      id: msg.sender,
      isConnected: false
    };

    this.init();
    this.sendCandidates();

    if (RTCSessionDescription) {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg), () => {
        // console.warn('Set setRemoteDescription, creating Answer');
        this.peerConnection.createAnswer((sessionDescription) => {
          if (this.debug) {
            console.log('Sending answer to ' + msg.sender);
          }
          this.peerConnection.setLocalDescription(sessionDescription);
          this.sendSignal(sessionDescription.toJSON());
        }, (err) => {
          if (this.debug) {
            console.error('Could not create offer', err);
          }
        });
      });

    }


  }

  onAnswerSignal(msg) {

    let RTCSessionDescription = (<any>window).RTCSessionDescription || (<any>window).mozRTCSessionDescription;
    if (this.debug) {
      console.log('Handling answer from ' + msg.sender);
    }
    if (RTCSessionDescription) {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
    }
  }

  onCandidateSignal(msg) {
    // console.warn(msg, this.id, msg.sender);
    let candidate = new (<any>window).RTCIceCandidate(msg);

    if (this.debug) {
      console.log('Adding candidate to peerConnection: ' + msg.sender);
    }

    this.peerConnection.addIceCandidate(candidate);

  }

  onSignal(snapshot) {


    let msg = JSON.parse(snapshot.data);
    let sender = msg.sender;
    let type = msg.type;

    if (this.debug) {
      console.log('Received a \'' + type + '\' signal from ' + sender + ' of type ' + type);
    }
    if (type === 'message') {
      this.onWebSocketMessage(msg);
    }
    if (type === 'ws-offer') {
      if (!this.hasWSConnection) {
        this.addWSPeer(msg);
        this.initSocket(msg);
      }
    }
    if (type === 'offer') {
      this.onOffer(msg);
    }
    if (type === 'answer') {
      this.onAnswerSignal(msg);
    }
    if (type === 'candidate' && this.hasPulse) {
      this.onCandidateSignal(msg);
    }


  }

  sendCandidates() {

    this.peerConnection.onicecandidate = this.onICECandidate.bind(this);

  }

  onICEStateChange() {
    // console.warn(this.peerConnection.iceConnectionState);
    if (this.peerConnection.iceConnectionState === 'disconnected') {
      if (this.debug) {
        console.log('Client disconnected!');
      }
      this.sendAnnounce();
    }

  }

  onICECandidate(ev) {

    let candidate = ev.candidate;
    if (candidate) {
      candidate = candidate.toJSON();
      candidate.type = 'candidate';
      if (this.debug) {
        console.log('Sending candidate');
      }
      this.sendSignal(candidate);
    } else {
      if (this.debug) {
        console.log('All candidates sent');
      }
    }

  }

  onDataChannel(ev) {

    ev.channel.onmessage = this.onDataChannelMessage.bind(this);

  }

  onDataChannelOpen() {

    if (this.debug) {
      console.log('Data channel created! The channel is: ' + this.channel.readyState);
    }

    if (this.channel.readyState === 'open') {

      this.isOpen = true;
      this.emitter.emit('open');

    }

  }

  onDataChannelClosed() {

    if (this.debug) {
      console.log('The data channel has been closed!');
    }

  }


  onDataChannelMessage(ev) {

    let msg = JSON.parse(ev.data);

    this.store.messages.push({
      id: this.count++,
      data: JSON.parse(msg.data),
      sender: msg.sender,
      createdAt: new Date()
    });
    this.messages.emit(this.store.messages[this.store.messages.length -1]);
    this.channelObserver.next(this.store.messages);
    if (this.debug) {
      console.log('Received Message: ' + ev.data);
    }

  }

  onWebSocketMessage(ev) {


    this.store.messages.push({
      id: this.count++,
      data: JSON.parse(ev.data),
      sender: ev.sender,
      createdAt: new Date()
    });

    this.messages.emit(this.store.messages[this.store.messages.length - 1]);
    this.channelObserver.next(this.store.messages);

    if (this.debug) {
      console.log('Received Message: ' + ev.data, {
        id: this.count++,
        data: JSON.parse(ev.data),
        sender: ev.sender,
        createdAt: new Date()
      });
    }

  }

  onWebSocketSignal(snapshot) {

    let msg = JSON.parse(snapshot.data);

    if (msg.constructor.name === 'String') {
      msg = JSON.parse(msg);
    }

    // if ( sender === this.remotePeer ) {
    if (this.debug) {
      console.log('Received a \'' + msg.type + '\' signal from ' + msg.sender + ' of type ' + msg.type);
    }

    if (msg.type === 'message') {
      this.onWebSocketMessage(msg);
    }

    if (msg.type === 'ws-offer') {
      this.addWSPeer(msg);
      this.initSocket(msg);
    }
    // if (msg.type === 'offer') {
    //   this.onOffer(msg);
    // }
    // if (msg.type === 'answer') {
    //   this.onAnswerSignal(msg);
    // }
    // if (msg.type === 'candidate' && this.hasPulse) {
    //   this.onCandidateSignal(msg);
    // }
    //  }


  }

  send(data: any) {

    let msg = JSON.stringify({
      type: 'message',
      sender: this.id,
      data: data
    });

    if (this.debug) {
      console.log(JSON.parse(JSON.stringify(msg, null, 4)));
    }

    if (Object.keys(this.connections).length > 0) {

      this.channel.send(msg);

    }

    if (Object.keys(this.websocketConnections).length > 0) {

      this.sendSocketMessage(data);

    }

  }

  sendSocketMessage(data: any) {

    let msg = JSON.stringify({
      type: 'message',
      sender: this.id,
      data: data
    });


    for (let prop in this.websocketConnections) {

      if (this.websocketConnections) {

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


  connect() {

    this.sendCandidates();

    this.peerConnection.createOffer((sessionDescription) => {
      if (this.debug) {
        console.log('Sending offer');
      }
      this.peerConnection.setLocalDescription(sessionDescription);
      this.sendSignal(sessionDescription.toJSON());
    }, function (err) {
      console.error('Could not create offer', err);
    });

  }


  init() {

    let RTCPeerConnection = (<any>window).RTCPeerConnection || (<any>window).mozRTCPeerConnection ||
      (<any>window).webkitRTCPeerConnection;



    if (this.hasRTCConnection === false) {

      this.peerConnection = new RTCPeerConnection(this.stun);
      this.peerConnection.ondatachannel = this.onDataChannel.bind(this);
      this.peerConnection.oniceconnectionstatechange = this.onICEStateChange.bind(this);

      this.channel = this.peerConnection.createDataChannel(this.name, this.peerConnectionConfig);
      this.channel.onopen = this.onDataChannelOpen.bind(this);
      this.channel.onmessage = this.onDataChannelMessage.bind(this);
      this.hasRTCConnection = true;

      if (this.debug) {
        console.log('Setting up peer connection');
      }


    }



  }

  addWSPeer(conf) {


    if (!this.websocketConnections[conf.id]) {

      this.websocketConnections[conf.id] = {
        id: conf.id,
        isConnected: true
      };

    }

    if (this.debug) {
      console.log('Setting up websocket connection with ' + this.websocketConnections[conf.id].id);
    }

  }

  initSocket(conf: any) {


    if (!this.hasWSConnection) {

      this.isOpen = true;
      this.hasWSConnection = true;

      this.channel = this.createWebSocketChannel();
      // create a child

      // this.channels.websocket = this.db.child('messages').child(this.id);
      // this.channels.websocket.on('child_added', this.onWebSocketSignal.bind(this));

      this.wss.onmessage = (msg) => this.onWebSocketSignal(msg);

      this.hasWSConnection = true;
      this.hasPulse = true;
      this.emitter.emit('open');

      if (this.debug) {
        console.log('Client has pulse');
      }

    }



  }

}
