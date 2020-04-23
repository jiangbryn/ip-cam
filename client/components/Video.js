import React from 'react';
import io from 'socket.io-client';
import VideoCall from "../helper/VideoCall";
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

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            localStream: {},
            remoteStreamUrl: '',
            streamUrl: '',
            initiator: false,
            peer: {},
            full: false,
            connecting: false,
            waiting: true
        };
        this.videoCall = new VideoCall();
    }

    componentDidMount() {
        const socket = io("https://127.0.0.1:3000");
        const component = this;
        this.setState({ socket });
        const { roomId } = this.props.roomId;
        this.getUserMedia().then(() => {
            socket.emit('join', { roomId: roomId });
        });
        socket.on('init', () => {
            component.setState({ initiator: true });
        });
        socket.on('ready', () => {
            component.enter(roomId);
        });
        socket.on('desc', data => {
            if (data.type === 'offer' && component.state.initiator) return;
            if (data.type === 'answer' && !component.state.initiator) return;
            component.call(data);
        });
        socket.on('disconnected', () => {
            component.setState({ initiator: true });
        });
        socket.on('full', () => {
            component.setState({ full: true });
        });
    }

    getUserMedia() {
        return new Promise((resolve, reject) => {
            const op = {
                video: {
                    width: { min: 160, ideal: 640, max: 1280 },
                    height: { min: 120, ideal: 360, max: 720 }
                },
                audio: true
            };
            navigator.getUserMedia(
                op,
                stream => {
                    this.setState({ streamUrl: stream, localStream: stream });
                    this.localVideo.srcObject = stream;
                    resolve();
                },
                () => {console.error('the getUserMedia is not supported!')}
            );
        });
    }

    enter(roomId) {
        this.setState({ connecting: true });
        const peer = this.videoCall.init(
            this.state.localStream,
            this.state.initiator
        );
        this.setState({ peer });

        peer.on('signal', data => {
            const signal = {
                room: roomId,
                desc: data
            };
            this.state.socket.emit('signal', signal);
        });
        peer.on('stream', stream => {
            this.remoteVideo.srcObject = stream;
            this.setState({ connecting: false, waiting: false });
        });
        peer.on('error', function(err) {
            console.log(err);
        });
    }

    call(otherId) {
        this.videoCall.connect(otherId);
    }

    renderFull() {
        if (this.state.full) {
            return 'The room is full';
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className='video-wrapper'>
                <video
                    autoPlay
                    className={classes.localVideo}
                    id='localVideo'
                    muted
                    ref={video => (this.localVideo = video)}
                />
                <video
                    autoPlay
                    className='remoteVideo'
                    id='remoteVideo'
                    muted
                    ref={video => (this.remoteVideo = video)}
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
        );
    }
}

export default withStyles(styles, { withTheme: true })(Video);
