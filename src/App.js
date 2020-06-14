import axios from "axios";
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
    CssBaseline,
    Typography
} from '@material-ui/core';

import useLocalStorage from "./utils/useLocalStorage";
import NavigationBar from "./NavigationBar";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import ExerciseListPage from "./ExerciseListPage";
import ExerciseDetailPage from "./ExerciseDetailPage";
import DemoPage from "./DemoPage";


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
                    <Route exact path="/">
                        <Typography paragraph>Home page.</Typography>
                    </Route>
                    <Route exact path="/demo">
                        <DemoPage />
                    </Route>
                    <Route exact path="/sign-in">
                        {isAuthenticated ? <Redirect to="/" /> : <SignInPage doSignIn={doSignIn} />}
                    </Route>
                    <Route exact path="/sign-up">
                        {isAuthenticated ? <Redirect to="/" /> : <SignUpPage />}
                    </Route>
                    <Route exact path="/profile">
                        {
                            isAuthenticated ?
                                <Typography paragraph>Profile page.</Typography> :
                                <Redirect to="/sign-in" />
                        }
                    </Route>
                    <Route exact path="/exercises/:exercise_id">
                        <ExerciseDetailPage />
                    </Route>
                    <Route exact path="/exercises">
                        <ExerciseListPage />
                    </Route>
                    <Route path="/">
                        <Typography>Page Not Found!</Typography>
                    </Route>
                </Switch>
            </main>
        </div>
    );
}

export default App;
