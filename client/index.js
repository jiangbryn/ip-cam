import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import VideoPreview from "./components/VideoPreview";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

const App = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <CameraIcon className={classes.icon} />
                    <Typography variant="h6" color="inherit" noWrap>
                        ip-cam
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <VideoPreview />
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* Setting */}
                    <div className={classes.heroButtons}>
                        <Grid container spacing={2} justify="center">
                            <Grid item>
                                <Button variant="outlined" color="primary">
                                    Setting 1
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="primary">
                                    Setting 2
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </main>
            {/* Footer */}
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    This is the end
                </Typography>
            </footer>
            {/* End footer */}
        </React.Fragment>
    )
};

ReactDOM.render(<App />, document.getElementById('root'));
