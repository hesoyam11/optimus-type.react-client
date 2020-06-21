import axios from "axios";
import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {
    CssBaseline,
    Typography
} from '@material-ui/core';

import useLocalStorage from "./utils/useLocalStorage";
import NavigationBar from "./NavigationBar";
import HomePage from "./HomePage";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import ExerciseListPage from "./ExerciseListPage";
import ExerciseDetailPage from "./ExerciseDetailPage";
import ExerciseTypePage from "./ExerciseTypePage";
import UserListPage from "./UserListPage";
import UserDetailPage from "./UserDetailPage";
import ExerciseCreatePage from "./ExerciseCreatePage";


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
    const [userId, setUserId] = useLocalStorage('userId', null);
    const [username, setUsername] = useLocalStorage('username', null);
    const [, setUserEmail] = useLocalStorage('userEmail', null);

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
            <CssBaseline/>
            <NavigationBar authToken={authToken} username={username} doSignOut={doSignOut}/>
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route exact path="/sign-in">
                        {isAuthenticated ? <Redirect to="/"/> : <SignInPage doSignIn={doSignIn}/>}
                    </Route>
                    <Route exact path="/sign-up">
                        {isAuthenticated ? <Redirect to="/"/> : <SignUpPage/>}
                    </Route>
                    <Route exact path="/profile">
                        {
                            isAuthenticated ?
                                <UserDetailPage userId={userId} /> :
                                <Redirect to="/sign-in"/>
                        }
                    </Route>
                    <Route exact path="/exercises">
                        <ExerciseListPage isAuthenticated={isAuthenticated} userId={userId}/>
                    </Route>
                    <Route exact path="/exercises/create">
                        {isAuthenticated ? <ExerciseCreatePage authToken={authToken}/> : <Redirect to="/sign-in"/>}
                    </Route>
                    <Route exact path="/exercises/:exerciseId">
                        <ExerciseDetailPage authToken={authToken} userId={userId} />
                    </Route>
                    <Route exact path="/exercises/:exerciseId/type">
                        <ExerciseTypePage authToken={authToken}/>
                    </Route>
                    <Route exact path="/users">
                        <UserListPage/>
                    </Route>
                    <Route exact path="/users/:userId">
                        <UserDetailPage/>
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
