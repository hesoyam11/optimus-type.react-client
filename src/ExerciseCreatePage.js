import axios from 'axios';
import React, {useState} from 'react';
import {
    Button,
    Container,
    CssBaseline,
    Grid,
    MenuItem,
    TextField,
    Typography
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";


const locales = [
    {
        value: 'en_US',
        label: 'en_US',
    },
    {
        value: 'uk_UA',
        label: 'uk_UA',
    },
    {
        value: 'ru_RU',
        label: 'ru_RU',
    }
];

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    }
}));

export default function ExerciseCreatePage(props) {
    const classes = useStyles();

    const authToken = props.authToken;

    const [locale, setLocale] = useState("en_US");
    const handleLocaleChange = (event) => {
        setLocale(event.target.value);
    };

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    New Exercise
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item md={8} xs={12}>
                            <TextField
                                required
                                id="title"
                                name="title"
                                label="Title"
                                variant="outlined"
                                fullWidth
                                autoFocus
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <TextField
                                id="locale"
                                select
                                label="Select language (locale)"
                                value={locale}
                                onChange={handleLocaleChange}
                                variant="outlined"
                                fullWidth
                            >
                                {locales.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="content"
                                name="content"
                                label="Content"
                                variant="outlined"
                                multiline
                                rows={10}
                                fullWidth
                                inputProps={{
                                    style: {
                                        fontFamily: "Monospace",
                                        fontSize: 18
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                // onClick={handleSignInClick}
                            >
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                    {/*{*/}
                    {/*    errorResponseData ?*/}
                    {/*        errorResponseData['nonFieldErrors'].map(*/}
                    {/*            (errorText) => (*/}
                    {/*                <FormHelperText*/}
                    {/*                    key={errorText}*/}
                    {/*                    error*/}
                    {/*                    variant="outlined"*/}
                    {/*                >*/}
                    {/*                    {errorText}*/}
                    {/*                </FormHelperText>*/}
                    {/*            )*/}
                    {/*        ) :*/}
                    {/*        null*/}
                    {/*}*/}
                </form>
            </div>
        </Container>
    );
};
