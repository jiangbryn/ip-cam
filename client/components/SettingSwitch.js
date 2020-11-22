import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 10,
  },
  desc: {
    color: 'slategray',
    fontSize: 20,
  },
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
});


class SettingSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checked: false
    }
  }
  render() {
    const { classes, off, on } = this.props;
    const handleChange = (event) => {
      this.props.setParentState(event.target.checked);
    };
    return(
      <div className={classes.container}>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item className={classes.desc}>{off}</Grid>
          <Grid item>
            <Switch checked={this.state.check} onChange={handleChange}/>
          </Grid>
          <Grid item className={classes.desc}>{on}</Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SettingSwitch);
