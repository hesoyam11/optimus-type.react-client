import axios from 'axios';
import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import {
    Button,
    Container,
    CssBaseline,
    FormHelperText,
    Grid,
    MenuItem,
    TextField,
    Typography
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";


const locales = [
    {
        value: 'enUS',
        label: 'en_US',
    },
    {
        value: 'ukUA',
        label: 'uk_UA',
    },
    {
        value: 'ruRU',
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

    const [errorResponseData, setErrorResponseData] = useState(null);
    const [createdExerciseId, setCreatedExerciseId] = useState(null);

    const [title, setTitle] = useState("");
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const [locale, setLocale] = useState("enUS");
    const handleLocaleChange = (event) => {
        setLocale(event.target.value);
    };

    const [content, setContent] = useState("");
    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleSubmitClick = (event) => {
        event.preventDefault();

        axios.post(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/exercises/`,
            {title, locale, content},
            {
                headers: {
                    "Authorization": `Token ${authToken}`
                }
            }
        )
            .then(res => {
                setCreatedExerciseId(res.data['id']);
            })
            .catch(error => {
                if (!error.response) {
                    alert("No response from server.");
                }
                else if (error.response.status !== 400) {
                    alert(error.response.data);
                }
                else {
                    setErrorResponseData(error.response.data);
                }
            });
    };

    if (createdExerciseId !== null) {
        return (
            <Redirect to={`/exercises/${createdExerciseId}`} />
        );
    }

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline/>
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
                                value={title}
                                onChange={handleTitleChange}
                                variant="outlined"
                                fullWidth
                                autoFocus
                                inputProps={{
                                    maxLength: 128
                                }}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <TextField
                                select
                                id="locale"
                                name="locale"
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
                                multiline rows={10}
                                id="content"
                                name="content"
                                label="Content"
                                value={content}
                                onChange={handleContentChange}
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                    style: {
                                        fontFamily: "Monospace",
                                        fontSize: 18
                                    },
                                    maxLength: 1024
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
                                onClick={handleSubmitClick}
                            >
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                    {
                        errorResponseData && errorResponseData['nonFieldErrors'] ?
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
                            errorResponseData ?
                                <FormHelperText>Unexpected validation error.</FormHelperText> :
                                null
                    }
                </form>
            </div>
        </Container>
    );
};
