import axios from "axios";
import React, {useState} from 'react';
import {Link as RouterLink, Redirect} from 'react-router-dom';
import {
    Avatar,
    Button,
    Container,
    CssBaseline,
    Grid,
    TextField,
    Typography,
    Link, FormHelperText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const createFormHelperTexts = (errorResponseData, fieldName) => {
    return (
        <React.Fragment>
            {
                errorResponseData && errorResponseData[fieldName] &&
                errorResponseData[fieldName].map(
                    (errorText) => (
                        <FormHelperText
                            key={errorText}
                            error
                            variant="outlined"
                        >
                            {errorText}
                        </FormHelperText>
                    )
                )
            }
        </React.Fragment>
    );
};

export default function SignUpPage() {
    const classes = useStyles();

    const [errorResponseData, setErrorResponseData] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const [username, setUsername] = useState("");
    const handleUsernameChange = event => setUsername(event.target.value);

    const [email, setEmail] = useState("");
    const handleEmailChange = event => setEmail(event.target.value);

    const [password, setPassword] = useState("");
    const handlePasswordChange = event => setPassword(event.target.value);

    const [repeatPassword, setRepeatPassword] = useState("");
    const handleRepeatPasswordChange = event => setRepeatPassword(event.target.value);

    const handleSignUpClick = (event) => {
        event.preventDefault();

        if (password !== repeatPassword) {
            setErrorResponseData({
                repeatPassword: [
                    "Passwords didn't match."
                ]
            });
            return;
        }

        axios.post(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/users/`,
            { username, email, password }
        )
            .then(() => {
                setIsRegistered(true);
            })
            .catch(error => {
                setErrorResponseData(error.response.data);
            });
    };

    if (isRegistered) {
        return (
            <Redirect to={`/sign-in`} />
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        { /*
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        */ }
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="username"
                                name="username"
                                value={username}
                                onChange={handleUsernameChange}
                                label="Username"
                                variant="outlined"
                                fullWidth
                            />
                            {createFormHelperTexts(errorResponseData, 'username')}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                label="Email Address"
                                variant="outlined"
                                fullWidth
                            />
                            {createFormHelperTexts(errorResponseData, 'email')}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                label="Password"
                                variant="outlined"
                                fullWidth
                            />
                            {createFormHelperTexts(errorResponseData, 'password')}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="repeat-password"
                                type="password"
                                name="repeat-password"
                                value={repeatPassword}
                                onChange={handleRepeatPasswordChange}
                                label="Repeat Password"
                                variant="outlined"
                                fullWidth
                            />
                            {createFormHelperTexts(errorResponseData, 'repeatPassword')}
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        className={classes.submit}
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={handleSignUpClick}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/sign-in" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
