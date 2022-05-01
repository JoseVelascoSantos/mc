import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Home from "./home"
import Bayes from "./bayes"
import Lloyd from "./lloyd"
import Kmeans from "./k-means"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function VerticalTabs() {
    const classes = useStyles();
    const [indexView, setIndexView] = React.useState(0);
    const [loaded, setLoaded] = React.useState(false);

    const handleChange = (event, newValue) => {
        setIndexView(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs value={indexView} onChange={handleChange} centered>
                <Tab label="Carga" disabled={loaded} />
                <Tab label="K-Means" disabled={!loaded} />
                <Tab label="Bayes" disabled={!loaded} />
                <Tab label="Lloyd" disabled={!loaded} />
            </Tabs>
            {/*}
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                <Tab label="Home" {...a11yProps(0)} />
                <Tab label="K-Means" {...a11yProps(1)} />
                <Tab label="Bayes" {...a11yProps(2)} />
                <Tab label="Lloyd" {...a11yProps(3)} />
            </Tabs>*/}
            <TabPanel value={indexView} index={0}>
                <Home onLoad={() => {
                    setLoaded(true);
                    setIndexView(1);
                }} />
            </TabPanel>
            <TabPanel value={indexView} index={1}>
                <Kmeans />
            </TabPanel>
            <TabPanel value={indexView} index={2}>
                <Bayes />
            </TabPanel>
            <TabPanel value={indexView} index={3}>
                <Lloyd />
            </TabPanel>
        </div>
    );
}
