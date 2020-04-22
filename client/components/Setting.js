import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import SettingSlider from "./SettingSlider";

const styles = theme => ({
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
        flexDirection: 'column'
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 20,
    }
});

const focal = [
    {
        value: 28,
        label: '28mm',
    },
    {
        value: 35,
        label: '35mm',
    },
    {
        value: 50,
        label: '50mm',
    },
    {
        value: 85,
        label: '85mm',
    },
];

const aperture = [
    {
        value: 2.8,
        label: 'f/2.8',
    },
    {
        value: 4.0,
        label: 'f/4.0',
    },
    {
        value: 5.6,
        label: 'f/5.6',
    },
    {
        value: 8.0,
        label: 'f/8.0',
    },
];


class Setting extends React.Component {
    constructor(){
        super();
    }
    render() {
        const { classes } = this.props;
        return(
            <Container maxWidth="sm" className={classes.container}>
                <Typography className={classes.title}>
                    Setting
                </Typography>
                <div className={classes.buttons}>
                    <SettingSlider marks={focal} max={85} min={28} title="FocalLength"/>
                    <SettingSlider marks={aperture} max={8.0} min={2.3} title="Aperture"/>
                </div>
            </Container>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Setting);