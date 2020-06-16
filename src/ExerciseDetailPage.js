import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
    Button,
    Container,
    Typography
} from "@material-ui/core";

import ExerciseItemPaper from "./ExerciseItemPaper";
import Grid from "@material-ui/core/Grid";


export default function ExerciseDetailPage() {
    const { exerciseId } = useParams();

    const [exercise, setExercise] = useState(null);

    useEffect(() => {
        if (exercise === null) {
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/exercises/${exerciseId}/`
            )
                .then(res => {
                    setExercise(res.data);
                })
                .catch(error => {
                    alert("An error happened while loading the exercise.");
                    console.log(error);
                })
        }
    });

    return (
        <Container component="main" maxWidth="md">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {
                        (exercise === null) ?
                            <Typography>Loading...</Typography> :
                            <ExerciseItemPaper exercise={exercise} />
                    }
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained" color="primary" fullWidth
                        component={NavLink} to={`/exercises/${exerciseId}/type`}
                    >
                        Start typing
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};
