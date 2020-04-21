import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    buttons: {
        marginTop: theme.spacing(4),
    },
}));

const Setting = () => {
    const classes = useStyles();
    return(
        <div className={classes.buttons}>
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
    );
}

export default Setting;