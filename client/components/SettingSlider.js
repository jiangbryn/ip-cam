import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const styles = theme => ({
    title: {
        color: 'slategray',
        fontFamily: 'Futura',
        fontSize: 20,
        justifyContent:'center',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    slider: {
        width: 450,
    }
});


class SettingSlider extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        const { classes } = this.props;
        return(
            <div className={classes.container}>
                <Typography className={classes.title} gutterBottom>
                    {this.props.title}
                </Typography>
                <Slider
                    className={classes.slider}
                    defaultValue={this.props.min}
                    aria-labelledby="slider-aperture"
                    step={null}
                    valueLabelDisplay="auto"
                    marks={this.props.marks}
                    min={this.props.min}
                    max={this.props.max}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(SettingSlider);