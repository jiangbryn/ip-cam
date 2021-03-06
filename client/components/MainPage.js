import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import VideoPreview from "./VideoPreview";
import Setting from "./Setting";
import {withStyles} from "@material-ui/core/styles";
import io from "socket.io-client";

const styles = theme => ({
    icon: {
        color: 'slategray',
        padding: 2,
    },
    barTitle: {
        color: 'slategray',
        fontFamily: 'Futura',
    },
    footer: {
        color: 'slategray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30,
        fontSize: 'x-small',
    }
});

class MainPage extends React.Component {
    constructor(){
        super();
    }
    render() {
        const { classes } = this.props;
        // To use ios app, it should connect to the ip addr of computer
        const socket = io.connect('http://172.17.16.250:3000');
        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="relative" color="default">
                    <Toolbar>
                        <CameraIcon className={classes.icon}/>
                        <Typography className={classes.barTitle}>
                            ip-cam
                        </Typography>
                    </Toolbar>
                </AppBar>
                {/* Hero unit */}
                <main>
                    <Container>
                        <VideoPreview roomId={this.props.match.params} socket={socket}/>
                    </Container>
                    <Container>
                        <Setting socket={socket}/>
                    </Container>
                </main>
                {/* Footer */}
                <footer>
                    <Typography className={classes.footer}>
                        This is the end
                    </Typography>
                </footer>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MainPage);
