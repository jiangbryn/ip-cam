import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from "@material-ui/core/Container";
import Video from "./Video";

const VideoPreview = ({roomId}) => {
    return (
        <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Video Preview
            </Typography>
            <div>
                <Video roomId={roomId}/>
            </div>
        </Container>
    );
};

export default VideoPreview;