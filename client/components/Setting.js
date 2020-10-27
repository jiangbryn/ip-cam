import SaveIcon from '@material-ui/icons/Save';
import Button from "@material-ui/core/Button";
import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import SettingSlider from "./ExpoSlider";
import SettingSwitch from "./SettingSwitch";

const styles = theme => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#ebf0f7',
        flexWrap: 'wrap',
        width: '80%',
    },
    title: {
        color: 'slategray',
        fontFamily: 'Futura',
        fontSize: 40,
        margin: 20,
        justifyContent:'center',
    },
    buttons: {
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    saveContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    saveButton: {
        textTransform: 'none',
        color: "slategray",
        margin: 20,
    },
});

class Setting extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            flash: false,
            isFront: false,
            expoTime: -1,
        }
        this.socket = this.props.socket;
    }
    componentDidMount() {
        this.socket.on('receiveSetting', (data) => {
            console.log(data);
        })
    }

    setFlash(flash) {
        this.setState({flash});
    }

    setFrontCamera(isFront) {
        this.setState({isFront});
    }

    setExpoTime(expoTime) {
        this.setState({expoTime});
    }

    render() {
        const { classes } = this.props;

        const handleSave = () => {
            this.socket.emit('setting', {
                flash : this.state.flash,
                isFront : this.state.isFront,
                expoTime: this.state.expoTime
            });
            console.log('sent settings')
        };

        return(
            <Container className={classes.container}>
                <Typography className={classes.title}>
                    Setting
                </Typography>
                <div className={classes.buttons}>
                    <SettingSlider max={100}
                                   min={0}
                                   title="Exposure Time"
                                   setParentState={expoTime => this.setExpoTime(expoTime)}
                    />
                    <SettingSwitch on={'Flash On'}
                                   off={'Flash Off'}
                                   setParentState={flash => this.setFlash(flash)}
                    />
                    <SettingSwitch on={'Front Camera'}
                                   off={'Back Camera'}
                                   setParentState={isFront => this.setFrontCamera(isFront)}
                    />
                    <div className={classes.saveContainer}>
                        <Button className={classes.saveButton} variant="outlined" endIcon={<SaveIcon/>} onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Setting);
