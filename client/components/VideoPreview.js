import React, {useState, useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from "@material-ui/core/Container";
import Video from "./Video";


const useStyles = makeStyles(theme => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
}));

const handleConnect = () => {};

const handleDisconnect = () => {};

const VideoPreview = () => {
    const classes = useStyles();
    return (
        <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Video Preview
            </Typography>
            <div className={classes.heroContent}>
                <Video/>
            </div>
            <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                    <Grid item>
                        <Button id="connect" variant="outlined" color="primary" onClick={handleConnect}>
                            Connect
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button id="disconnect" variant="outlined" color="primary" onClick={handleDisconnect}>
                            Disconnect
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default VideoPreview;