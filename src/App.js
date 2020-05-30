import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

import NavigationBar from "./NavigationBar";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },

}));

function App() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <NavigationBar />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route path="/me">
                        <Typography paragraph>Profile page.</Typography>
                    </Route>
                    <Route path="/about">
                        <Typography paragraph>About page.</Typography>
                    </Route>
                    <Route path="/">
                        <Typography paragraph>Home page.</Typography>
                    </Route>
                </Switch>
            </main>
        </div>
    );
}

export default App;
