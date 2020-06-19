import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {NavLink, Redirect, useParams} from 'react-router-dom';
import {
    Button,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    Typography
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardIcon from '@material-ui/icons/Keyboard';

import ExerciseItemPaper from "./ExerciseItemPaper";


export default function ExerciseDetailPage(props) {
    const {exerciseId} = useParams();

    const authToken = props.authToken;
    const userId = props.userId;

    const [exercise, setExercise] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = () => {
        axios.delete(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/exercises/${exerciseId}/`,
            {
                headers: {
                    "Authorization": `Token ${authToken}`
                }
            }
        )
            .then(() => {
                setIsDeleted(true);
            })
            .catch(() => {
                alert("Error happened while deleting the exercise.")
            });
    };

    if (isDeleted) {
        return (
            <Redirect to={`/exercises`} />
        );
    }

    return (
        <Container component="main" maxWidth="md">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {
                        (exercise === null) ?
                            <Typography>Loading...</Typography> :
                            <ExerciseItemPaper exercise={exercise}/>
                    }
                </Grid>
                {
                    exercise && userId === exercise['creator']['id'] &&
                    <Grid item xs={12}>
                        <Button
                            variant="contained" color="secondary" fullWidth
                            startIcon={<DeleteIcon/>}
                            onClick={handleDeleteClick}
                        >
                            Delete exercise
                        </Button>
                        <Dialog
                            open={openDeleteDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                Confirm deleting the exercise
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete the exercise?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCancelDelete} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                }
                <Grid item xs={12}>
                    <Button
                        variant="contained" color="primary" fullWidth
                        startIcon={<KeyboardIcon/>}
                        component={NavLink} to={`/exercises/${exerciseId}/type`}
                    >
                        Start typing
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};
