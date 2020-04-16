import Peer from 'simple-peer';
import React from "react";

class VideoCall extends React.Component {
    constructor(){
        super();
        this.peer = null;
    }

    init(stream, initiator) {
        this.peer = new Peer({
            initiator: initiator,
            stream: stream,
            trickle: false,
            reconnectTimer: 1000,
            iceTransportPolicy: 'relay',
            config: {
                iceServers: [
                    { urls: "stun:stun4.l.google.com:19302" },
                ]
            }
        })
        return this.peer
    }
    connect(otherId) {
        this.peer.signal(otherId)
    }
}

export default VideoCall;