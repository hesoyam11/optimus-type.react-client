import axios from "axios";
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {
    CssBaseline,
    Typography
} from '@material-ui/core';

import NavigationBar from "./NavigationBar";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Demo from "./Demo";
import useLocalStorage from "./utils/useLocalStorage";


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
    }
}));

function App() {
    const classes = useStyles();

    const [authToken, setAuthToken] = useLocalStorage('authToken', null);
    const [ , setUserId] = useLocalStorage('userId', null);
    const [username, setUsername] = useLocalStorage('username', null);
    const [ , setUserEmail] = useLocalStorage('userEmail', null);

    const isAuthenticated = (authToken !== null);

    const doSignIn = (authToken) => {
        setAuthToken(authToken);

        axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/users/me/`,
            {
                headers: {
                    "Authorization": `Token ${authToken}`
                }
            }
        )
            .then((res) => {
                setUserId(res.data["id"]);
                setUsername(res.data["username"]);
                setUserEmail(res.data["email"]);
            })
            .catch(() => {
                alert(
                    "Something went wrong while loading your profile data."
                );
                setAuthToken(null);
            });
    };

    const doSignOut = () => {
        setAuthToken(null);
        setUserId(null);
        setUsername(null);
        setUserEmail(null);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <NavigationBar authToken={authToken} username={username} doSignOut={doSignOut}/>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route path="/demo">
                        <Demo />
                    </Route>
                    <Route path="/sign-in">
                        {isAuthenticated ? <Redirect to="/" /> : <SignIn doSignIn={doSignIn} />}
                    </Route>
                    <Route path="/sign-up">
                        {isAuthenticated ? <Redirect to="/" /> : <SignUp />}
                    </Route>
                    <Route path="/me">
                        {
                            isAuthenticated ?
                                <Typography paragraph>Profile page.</Typography> :
                                <Redirect to="/sign-in" />
                        }
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
