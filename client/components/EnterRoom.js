import React, { useState } from 'react'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { withRouter } from 'react-router';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        justifyItems: 'center',
        flexDirection: 'column',
    },
    form: {
        margin: 50,
        flexDirection: 'row',
        color: "slategray",
    },
    button: {
        textTransform: 'none',
        color: "slategray",
        margin: 10,
    },
});

const goToRoom = (history, roomId) => {
    history.push(`/${roomId}`)
}

function EnterRoomComponent({history}) {
    let [roomId, setRoomId] = useState();
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <form className={classes.form}>
                <TextField value={roomId} placeholder="Room id" onChange={(event) => {
                    setRoomId(event.target.value)
                }} />
                <Button className={classes.button} variant="outlined" onClick={() => {goToRoom(history, roomId)}}>
                    Enter
                </Button>
            </form>
        </div>)
}

export const EnterRoom = withRouter(EnterRoomComponent);
