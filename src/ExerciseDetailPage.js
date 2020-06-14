import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography
} from "@material-ui/core";

import ExerciseItemPaper from "./ExerciseItemPaper";


export default function ExerciseDetailPage() {
    const { exercise_id } = useParams();

    const [exercise, setExercise] = useState(null);

    useEffect(() => {
        if (exercise === null) {
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/exercises/${exercise_id}/`
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
        <Container component="main" maxWidth="md">{
            (exercise === null) ?
                <Typography>Loading...</Typography> :
                <ExerciseItemPaper exercise={exercise} />
        }</Container>
    );
};
