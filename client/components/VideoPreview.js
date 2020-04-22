import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from "@material-ui/core/Container";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Video from "./Video";
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 40,
    },
    title: {
        color: 'slategray',
        fontFamily: 'Futura',
        fontSize: 40,
        margin: 20,
        justifyContent:'center',
    },
    video: {
        margin: 20,
    },
    button: {
        textTransform: 'none',
        color: "slategray",
        margin: 10,
    }
});

const VideoPreview = ({roomId}) => {
    const classes = useStyles();
    return (
        <Container maxWidth="sm" className={classes.container}>
            <Typography className={classes.title}>
                Video Preview
            </Typography>
            <div className={classes.video}>
                <Video roomId={roomId}/>
            </div>
            <Button className={classes.button} variant="outlined" endIcon={<SendIcon/>}>
                Screenshot
            </Button>
        </Container>
    );
};

export default VideoPreview;