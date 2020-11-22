import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import Container from "@material-ui/core/Container";

const styles = theme => ({
    videoWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    buttons: {
        margin: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    status: {
        color: 'slategray',
        fontSize: 20,
    },
    localVideo: {
        display: 'none',
    },
    button: {
        textTransform: 'none',
        color: "slategray",
        margin: 20,
    }
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

const constraints = {
    video: {
        width: { min: 160, ideal: 640, max: 1280 },
        height: { min: 120, ideal: 360, max: 720 }
    },
};

class Video extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            connecting: false,
            waiting: true,
            connected: false,
        }
        this.initiator = false

        // https://reactjs.org/docs/refs-and-the-dom.html
        this.localVideoref = React.createRef()
        this.remoteVideoref = React.createRef()

        this.pc = null
        this.socket = null
        this.candidates = []
    }

    componentDidMount() {
        this.socket = this.props.socket;

        this.socket.on('on-connect', (data) => {
            this.setState({waiting: false, connected: true});
            this.initiator = data.initiator;
            console.log(`on-connect: is the ${data.initiator ? 'caller' : 'callee'}`);
        });

        this.socket.on('established', () => {
            if (this.initiator) {
                this.createOffer();
            }
        })

        this.socket.on('offer-or-answer', (sdp) => {
            // set sdp as remote description
            console.log(`received an ${sdp.type}`);
            this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
                .then(() => {
                    if (sdp.type === 'offer') {
                        this.createAnswer();
                    }
                })
                .catch(e => console.log(e));
        })

        this.socket.on('candidate', (candidate) => {
            this.candidates = [...this.candidates, candidate]
            this.pc.addIceCandidate(new RTCIceCandidate(candidate))
            this.pc.getStats(null).then((stats) => {
                for (const {type, state, localCandidateId} of stats.values()) {
                    if (type === 'candidate-pair' && state === 'succeeded')
                        console.log(`type: ${type}, state: ${state}, can: ${localCandidateId}`)
                }
            })
        })

        this.socket.on('ready', () => {
            this.setState({ waiting: true })
        })
    }

    setupPC() {
        this.pc = new RTCPeerConnection(pc_config);

        // triggered when there is a change in connection state
        this.pc.oniceconnectionstatechange = (e) => {
            if (this.pc.iceConnectionState === 'disconnected') {
                this.setState({ waiting: true, connected: false});
                this.releaseStream();
            }
        }

        // triggered when a new candidate is returned
        this.pc.onicecandidate = (e) => {
            // send the candidates to the remote peer
            // see addCandidate below to be triggered on the remote peer
            if (e.candidate) {
                // console.log(JSON.stringify(e.candidate))
                this.sendToPeer('candidate', e.candidate)
            }
        }

        // triggered when a stream is added to pc, see below - this.pc.addStream(stream)
        this.pc.ontrack = (e) => {
            console.log(`Add remote track: ${JSON.stringify(e)}`)
            this.remoteVideoref.current.srcObject = e.streams[0]
        }

        // called when getUserMedia() successfully returns
        const success = (stream) => {
            window.localStream = stream
            this.localVideoref.current.srcObject = stream
            this.pc.addStream(stream)
        }

        // called when getUserMedia() fails
        const failure = (e) => {
            console.log('getUserMedia Error: ', e)
        }

        navigator.mediaDevices.getUserMedia(constraints)
          .then(success)
          .catch(failure)
    }

    releaseStream() {
        if (this.localVideoref.current.srcObject !== null) {
            this.localVideoref.current.srcObject.getTracks().forEach(track => track.stop());
            this.localVideoref.current.srcObject = null;
        }
        if (this.remoteVideoref.current.srcObject !== null) {
            this.remoteVideoref.current.srcObject.getTracks().forEach(track => track.stop());
            this.remoteVideoref.current.srcObject = null;
        }
    }

    sendToPeer(messageType, data) {
        this.socket.emit(messageType, data)
    }

    createOffer() {
        console.log(`Create offer: created by ${this.initiator ? 'caller' : 'callee'}`)
        // initiates the creation of SDP
        this.pc.createOffer({ offerToReceiveVideo: 1 })
            .then(sdp => {
                // console.log(JSON.stringify(sdp))
                // set offer sdp as local description
                this.pc.setLocalDescription(sdp).catch((e) => console.log(e))
                this.sendToPeer('offer-or-answer', sdp)
            }).catch(e => console.log(e))
    }

    // creates an SDP answer to an offer received from remote peer
    createAnswer() {
        console.log(`Create answer: created by ${this.initiator ? 'caller' : 'callee'}`)
        this.pc.createAnswer({ offerToReceiveVideo: 1 })
            .then(sdp => {
                // console.log(JSON.stringify(sdp))
                // set answer sdp as local description
                this.pc.setLocalDescription(sdp).catch((e) => console.log(e))
                this.sendToPeer('offer-or-answer', sdp)
            }).catch(e => console.log(e))
    }

    renderButton() {
        if (!this.state.connected) {
            return 'Connect';
        } else {
            return 'Disconnect';
        }
    }

    renderStatusDesc() {
        if (this.state.connecting) {
            return 'Establishing connection...';
        } else if (this.state.waiting) {
            return 'Waiting for connection...';
        }
    }

    render() {
        const { classes } = this.props
        const handleConnect = () => {
            if (this.state.connected === false) {
                this.socket.emit('on-connect');
                this.setupPC();
            } else {
                console.log('close');
                this.setState({connected: false});
                this.initiator = false;
                this.pc.close();
                this.pc = null;
                this.releaseStream();
                this.socket.emit('close');
            }
        };
        const handlePhoto = () => {
            this.socket.emit('take-photo');
            console.log('take-photo');
        }
        return (
            <Container className='video-wrapper'>
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
                <div className={classes.status}>
                    {this.renderStatusDesc()}
                </div>
                <div className={classes.buttons}>
                    <Button className={classes.button}
                            variant="outlined"
                            onClick={handleConnect}>
                        {this.renderButton()}
                    </Button>
                    <Button className={classes.button}
                            variant="outlined"
                            onClick={handlePhoto}
                            endIcon={<SendIcon/>}>
                        Take Photo
                    </Button>
                </div>
            </Container>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Video);
