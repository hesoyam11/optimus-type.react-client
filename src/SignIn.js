import axios from 'axios';
import React, {useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar,
    Button,
    Container,
    CssBaseline,
    FormHelperText,
    Grid,
    Link,
    TextField,
    Typography
} from '@material-ui/core';
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    const classes = useStyles();

    const [errorResponseData, setErrorResponseData] = useState();

    const [username, setUsername] = useState('');
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const [password, setPassword] = useState('');
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSignInClick = (event) => {
        event.preventDefault();

        axios.post(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/token/login/`,
            { username, password }
            )
            .then(res => {
                const authToken = res.data['authToken'];
                props.doSignIn(authToken);
            })
            .catch(error => {
                setErrorResponseData(error.response.data);
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        autoComplete="current-password"
                    />
                    {/* TODO: "Remember me" button? */}
                    {/*<FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />*/}
                    {
                        errorResponseData ?
                            errorResponseData['nonFieldErrors'].map(
                                (errorText) => (
                                    <FormHelperText
                                        key={errorText}
                                        error
                                        variant="outlined"
                                    >
                                        {errorText}
                                    </FormHelperText>
                                )
                            ) :
                            null
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSignInClick}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        {/* TODO: Forgot password email flow. */}
                        {/*<Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>*/}
                        <Grid item>
                            <Link component={RouterLink} to="/sign-up" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
