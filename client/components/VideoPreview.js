import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from "@material-ui/core/Container";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Video from "./Video";

const useStyles = makeStyles({
    title: {
        color: 'slategray',
        fontFamily: 'Futura',
        fontSize: 40,
        padding: 60,
        justifyContent:'center',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
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
            <div>
                <Video roomId={roomId}/>
            </div>
            <Button className={classes.button} variant="outlined">
                Screenshot
            </Button>
        </Container>
    );
};

export default VideoPreview;