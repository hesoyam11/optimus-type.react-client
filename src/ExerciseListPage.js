import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {NavLink} from "react-router-dom";
import {
    Button,
    Container,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

import ExerciseItemPaper from "./ExerciseItemPaper";


export default function ExerciseListPage(props) {
    const isAuthenticated = props.isAuthenticated;

    const [titleSearchTerm, setTitleSearchTerm] = useState("");
    const handleTitleSearchTermChange = (event) => {
        setTitleSearchTerm(event.target.value);
    };

    const [exercises, setExercises] = useState(null);
    const [nextPageLink, setNextPageLink] = useState(null);

    useEffect(() => {
        if (exercises === null) {
            handleSearchClick();
        }
    });

    const handleSearchClick = () => {
        const queryParams = {};

        if (titleSearchTerm !== "") {
            queryParams['search'] = titleSearchTerm;
        }

        axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/exercises`,
            {
                params: queryParams
            }
        )
            .then(res => {
                setExercises(res.data['results']);
                setNextPageLink(res.data['next']);
            })
            .catch(error => {
                alert("An error happened while loading exercises.");
                console.log(error);
            });
    };

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
        <Container component="main" maxWidth="md">{
            exercises === null ? <Typography>Loading...</Typography> :
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <form>
                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <TextField
                                        id="search-by-title"
                                        label="Search by title"
                                        type="search"
                                        value={titleSearchTerm}
                                        onChange={handleTitleSearchTermChange}
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SearchIcon/>}
                                        size="large"
                                        fullWidth
                                        style={{
                                            height: "100%"
                                        }}
                                        onClick={handleSearchClick}
                                    >
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                    {
                        isAuthenticated && <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon/>}
                                component={NavLink}
                                to="/exercises/create"
                            >
                                Create exercise
                            </Button>
                        </Grid>
                    }
                    {
                        exercises.map((item) => (
                            <Grid key={item['id']} item xs={12} md={6}>
                                <ExerciseItemPaper shortifyContent exercise={item}/>
                            </Grid>
                        ))
                    }
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
        }</Container>
    );
};
