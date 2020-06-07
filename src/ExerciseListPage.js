import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Container,
    Divider,
    Grid,
    Paper,
    Typography
} from "@material-ui/core";

import { localeFromInternalToHumanValue } from './utils/localeUtils.js';


const useStyles = makeStyles((theme) => ({
    // TODO: Check this out?
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(3),
        width: "100%",
    }
}));

export default function ExerciseListPage() {
    const classes = useStyles();

    const [exercises, setExercises] = useState([]);
    const [nextPageLink, setNextPageLink] = useState(null);

    useEffect(() => {
        if (exercises.length === 0) {
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/exercises/`
            )
                .then(res => {
                    setExercises(res.data['results']);
                    setNextPageLink(res.data['next']);
                })
                .catch(error => {
                    alert("An error happened while loading exercises.");
                    console.log(error);
                })
        }
    });

    const handleShowMoreClick = () => {
        if (nextPageLink === null) return;

        axios.get(`${nextPageLink}`)
            .then(res => {
                setExercises(exercises.concat(res.data['results']));
                setNextPageLink(res.data['next']);
            })
            .catch(error => {
                alert("An error happened while loading exercises.");
                console.log(error);
            })
    };

    return (
        <Container component="main" maxWidth="md">
            <Grid container spacing={2}>
                {exercises.map((item) => (
                    <Grid key={item['id']} item xs={12} md={6}>
                        <Paper className={classes.paper}>
                            <Typography component="h2" variant="h5">
                                {item['title']}
                            </Typography>
                            <Divider />
                            <Typography color="textSecondary">
                                Locale: {localeFromInternalToHumanValue[item['locale']]}
                            </Typography>
                            <Typography color="textSecondary">
                                Created by {item['creator']['username']} on {(new Date(item['createdAt'])).toDateString()}
                            </Typography>
                            <Typography>
                                {item['content'].slice(0, 256) + (item['content'].length > 256 ? "..." : "")}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
                {
                    nextPageLink &&
                        <Grid key={-1} item xs={12}>
                            <Button
                                variant="contained" color="primary" fullWidth
                                onClick={handleShowMoreClick}
                            >
                                Show more search results
                            </Button>
                        </Grid>
                }
            </Grid>
        </Container>
    );
};
