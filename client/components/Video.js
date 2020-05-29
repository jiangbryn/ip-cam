import React from 'react';
import io from 'socket.io-client';
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    videoWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    status: {
        color: 'slategray',
        fontSize: 20,
    },
    localVideo: {
        display: 'none',
    },
});

const pc_config = {
    iceServers: [
        { urls: "stun:stun4.l.google.com:19302" },
        {
            urls: "turn:numb.viagenie.ca",
            username: "bingyujiang2021@u.northwestern.edu",
            credential: "8983121"
        },
    ]
};

class Video extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initiator: false,
            full: false,
            connecting: false,
            waiting: true
        }

        // https://reactjs.org/docs/refs-and-the-dom.html
        this.localVideoref = React.createRef()
        this.remoteVideoref = React.createRef()

        this.pc = null
        this.socket = null
        this.candidates = []
    }

    componentDidMount() {
        this.pc = new RTCPeerConnection(pc_config)
        this.socket = io.connect('http://192.168.1.72:3000')
        const { roomId } = this.props.roomId;

        this.socket.on('init', () => {
            this.setState({ initiator: true });
        })

        this.socket.on('ready', () => {
            this.enterRoom(roomId);
        })

        this.socket.on('full', () => {
            this.setState({ full: true });
        });

        this.socket.on('offerOrAnswer', (sdp) => {
            // set sdp as remote description
            if (sdp.type === 'offer' && this.state.initiator) return
            if (sdp.type === 'answer' && !this.state.initiator) return;
            this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
            this.createAnswer()
        })

        this.socket.on('candidate', (candidate) => {
            // console.log('From Peer... ', JSON.stringify(candidate))
            // this.candidates = [...this.candidates, candidate]
            this.pc.addIceCandidate(new RTCIceCandidate(candidate))
        })

        // triggered when a new candidate is returned
        this.pc.onicecandidate = (e) => {
            // send the candidates to the remote peer
            // see addCandidate below to be triggered on the remote peer
            if (e.candidate) {
                // console.log(JSON.stringify(e.candidate))
                this.sendToPeer('candidate', e.candidate)
            }
        }

        // triggered when there is a change in connection state
        this.pc.oniceconnectionstatechange = (e) => {
            console.log(e)
        }

        // triggered when a stream is added to pc, see below - this.pc.addStream(stream)
        // this.pc.onaddstream = (e) => {
        //   this.remoteVideoref.current.srcObject = e.stream
        // }
        this.pc.ontrack = (e) => {
            debugger
            this.remoteVideoref.current.srcObject = e.streams[0]
        }

        // called when getUserMedia() successfully returns - see below
        const success = (stream) => {
            this.socket.emit('join', { roomId: roomId });
            window.localStream = stream
            this.localVideoref.current.srcObject = stream
            this.pc.addStream(stream)
        }

        // called when getUserMedia() fails - see below
        const failure = (e) => {
            console.log('getUserMedia Error: ', e)
        }

        const constraints = {
            // audio: true,
            video: {
                width: { min: 160, ideal: 640, max: 1280 },
                height: { min: 120, ideal: 360, max: 720 }
            },
        }

        navigator.mediaDevices.getUserMedia(constraints)
            .then(success)
            .catch(failure)
    }

    enterRoom() {
        this.setState({ connecting: true })
        if(this.state.initiator === true) {
            this.createOffer()
        }
    }

    sendToPeer(messageType, data) {
        this.socket.emit(messageType, data)
    }

    createOffer() {
        console.log('Offer')

        // initiates the creation of SDP
        this.pc.createOffer({ offerToReceiveVideo: 1 })
            .then(sdp => {
                // console.log(JSON.stringify(sdp))
                // set offer sdp as local description
                this.pc.setLocalDescription(sdp)
                this.sendToPeer('offerOrAnswer', sdp)
            })
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
    // creates an SDP answer to an offer received from remote peer
    createAnswer() {
        console.log('Answer')
        this.pc.createAnswer({ offerToReceiveVideo: 1 })
            .then(sdp => {
                // console.log(JSON.stringify(sdp))
                // set answer sdp as local description
                this.pc.setLocalDescription(sdp)
                this.sendToPeer('offerOrAnswer', sdp)
            })
    }

    renderFull() {
        if (this.state.full) {
            return 'The room is full';
        }
    }

    render() {
        const { classes } = this.props
        console.log(this.pc)
        return (
            <div className='video-wrapper'>
                <video
                    autoPlay
                    className={classes.localVideo}
                    id='localVideo'
                    muted
                    ref={this.localVideoref}
                />
                <video
                    autoPlay
                    className='remoteVideo'
                    id='remoteVideo'
                    muted
                    ref={this.remoteVideoref}
                />
                {this.state.connecting && (
                    <div className={classes.status}>
                        <p>Establishing connection...</p>
                    </div>
                )}
                {this.state.waiting && (
                    <div className={classes.status}>
                        <p>Waiting for remote device...</p>
                    </div>
                )}
                {this.renderFull()}
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Video);
