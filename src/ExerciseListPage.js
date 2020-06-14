import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Grid
} from "@material-ui/core";

import ExerciseItemPaper from "./ExerciseItemPaper";


export default function ExerciseListPage() {
    const [exercises, setExercises] = useState(null);
    const [nextPageLink, setNextPageLink] = useState(null);

    useEffect(() => {
        if (exercises === null) {
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
                {exercises !== null && exercises.map((item) => (
                    <Grid key={item['id']} item xs={12} md={6}>
                        <ExerciseItemPaper shortifyContent exercise={item} />
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
