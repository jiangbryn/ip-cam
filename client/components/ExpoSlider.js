import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const styles = theme => ({
    title: {
        color: 'slategray',
        fontSize: 20,
        justifyContent:'center',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 10,
    },
    slider: {
        width: 450,
        color: 'slategray'
    }
});


class ExpoSlider extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        const { classes } = this.props;
        const handleChange = (event, newValue) => {
            newValue === 0 ?
              this.props.setParentState(-1) : this.props.setParentState(newValue/100)
        };
        const valueLabelFormat = (value) => {
            if (value === 0) {
                return -1;
            }
            return value/100;
        }
        return(
            <div className={classes.container}>
                <Typography className={classes.title} gutterBottom>
                    {this.props.title}
                </Typography>
                <Slider
                    className={classes.slider}
                    defaultValue={this.props.min}
                    valueLabelDisplay="auto"
                    valueLabelFormat={valueLabelFormat}
                    min={this.props.min}
                    max={this.props.max}
                    onChange={handleChange}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ExpoSlider);
