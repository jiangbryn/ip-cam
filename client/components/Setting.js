import SaveIcon from '@material-ui/icons/Save';
import Button from "@material-ui/core/Button";
import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import SettingSlider from "./SettingSlider";

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
    constructor(props){
        super(props);
        this.socket = this.props.socket;
    }
    componentDidMount() {
        this.socket.on('receiveSetting', (data) => {
            console.log(data);
        })
    }

    render() {
        const { classes } = this.props;
        const handleSave = () => {
            this.socket.emit('setting', { setting1 : 'aaa'});
            console.log('sentsetting')
        };
        return(
            <Container className={classes.container}>
                <Typography className={classes.title}>
                    Setting
                </Typography>
                <div className={classes.buttons}>
                    <SettingSlider marks={focal} max={85} min={28} title="FocalLength"/>
                    <SettingSlider marks={aperture} max={8.0} min={2.8} title="Aperture"/>
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
