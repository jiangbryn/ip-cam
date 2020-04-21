import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import VideoPreview from "./VideoPreview";
import Setting from "./Setting";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    content: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

class MainPage extends React.Component {
    constructor(){
        super();
    }
    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="relative">
                    <Toolbar>
                        <CameraIcon/>
                        <Typography variant="h6" color="inherit" noWrap>
                            ip-cam
                        </Typography>
                    </Toolbar>
                </AppBar>
                {/* Hero unit */}
                <main>
                    <div>
                        <VideoPreview roomId={this.props.match.params}/>
                    </div>
                    <Container maxWidth="md">
                        <Setting/>
                    </Container>
                </main>
                {/* Footer */}
                <footer>
                    <Typography variant="h6" align="center" gutterBottom>
                        This is the end
                    </Typography>
                </footer>
            </React.Fragment>
        );
    }
}

export default MainPage;