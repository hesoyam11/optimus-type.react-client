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
    Paper,
    Table,
    TableContainer,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Typography
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import {makeStyles} from "@material-ui/core/styles";

import ExerciseItemPaper from "./ExerciseItemPaper";


const useStyles = makeStyles({
    table: {
        minWidth: 400,
    },
});

export default function ExerciseDetailPage(props) {
    const classes = useStyles();

    const {exerciseId} = useParams();

    const authToken = props.authToken;
    const userId = props.userId;

    const [exercise, setExercise] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [fastestAttempts, setFastestAttempts] = useState(null);
    const [myLatestAttempts, setMyLatestAttempts] = useState(null);

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

    useEffect(() => {
        if (fastestAttempts === null) {
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/fastest-attempts/`,
                {
                    params: {
                        exercise: exerciseId,
                        ordering: "time_spent"
                    }
                }
            )
                .then(res => {
                    setFastestAttempts(res.data['results']);
                })
                .catch(error => {
                    alert("An error happened while loading the fastest attempts.");
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        if (authToken === null) {
            return;
        }

        if (myLatestAttempts === null) {
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/attempts/`,
                {
                    params: {
                        exercise: exerciseId,
                        creator: userId,
                        ordering: "-created_at"
                    }
                }
            )
                .then(res => {
                    setMyLatestAttempts(res.data['results']);
                })
                .catch(error => {
                    alert("An error happened while loading yout latest attempts.");
                    console.log(error);
                });
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
            <Redirect to={`/exercises`}/>
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
                <Grid item container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">Fastest Attempts</Typography>
                        {
                            (fastestAttempts === null) ? <Typography>
                                Loading...
                            </Typography> : <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User</TableCell>
                                            <TableCell align="right">Score&nbsp;(ms)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fastestAttempts.map((row) => (
                                            <TableRow key={row['creator']['username']}>
                                                <TableCell component="th" scope="row">
                                                    {row['creator']['username']}
                                                </TableCell>
                                                <TableCell align="right">{row['timeSpent']}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">My Latest Attempts</Typography>
                        {
                            (authToken === null) ? <Typography>
                                    Sign In to save and see your latest attempts.
                                </Typography> :
                                (myLatestAttempts === null) ? <Typography>
                                    Loading...
                                </Typography> : <TableContainer component={Paper}>
                                    <Table className={classes.table} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>User</TableCell>
                                                <TableCell align="right">Score&nbsp;(ms)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {myLatestAttempts.map((row) => (
                                                <TableRow key={row['creator']['username']}>
                                                    <TableCell component="th" scope="row">
                                                        {row['creator']['username']}
                                                    </TableCell>
                                                    <TableCell align="right">{row['timeSpent']}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};
