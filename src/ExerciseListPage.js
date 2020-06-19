import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {NavLink} from "react-router-dom";
import {
    Button,
    Container,
    Grid, MenuItem,
    TextField,
    Typography
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

import ExerciseItemPaper from "./ExerciseItemPaper";


const locales = [
    {
        value: 'all',
        label: 'All'
    },
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

const orderings = [
    {
        value: 'created_at',
        label: 'Creation time ASC'
    },
    {
        value: '-created_at',
        label: 'Creation time DESC'
    },
    {
        value: 'title',
        label: 'Title ASC'
    },
    {
        value: '-title',
        label: 'Title DESC'
    }
];

export default function ExerciseListPage(props) {
    const isAuthenticated = props.isAuthenticated;

    const [titleSearchTerm, setTitleSearchTerm] = useState("");
    const handleTitleSearchTermChange = (event) => {
        setTitleSearchTerm(event.target.value);
    };

    const [locale, setLocale] = useState('all');
    const handleLocaleChange = (event) => {
        setLocale(event.target.value);
    };

    const [ordering, setOrdering] = useState('-created_at');
    const handleOrderingChange = (event) => {
        setOrdering(event.target.value);
    }

    const [exercises, setExercises] = useState(null);
    const [nextPageLink, setNextPageLink] = useState(null);

    const updateSearchResults = () => {
        const queryParams = {
            ordering: ordering
        };

        if (titleSearchTerm !== "") {
            queryParams['search'] = titleSearchTerm;
        }

        if (locale !== "all") {
            queryParams['locale'] = locale;
        }

        axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/exercises/`,
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

    useEffect(() => {
        if (exercises === null) {
            updateSearchResults();
        }
    });

    const handleSearchClick = (event) => {
        event.preventDefault();

        updateSearchResults();
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
                                        name="search-by-title"
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
                                        type="submit"
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
                                <Grid item xs={6}>
                                    <TextField
                                        select
                                        id="locale"
                                        name="locale"
                                        label="Filter by language (locale)"
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
                                <Grid item xs={6}>
                                    <TextField
                                        select
                                        id="order-by"
                                        name="order-by"
                                        label="Order results by"
                                        value={ordering}
                                        onChange={handleOrderingChange}
                                        variant="outlined"
                                        fullWidth
                                    >
                                        {orderings.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
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
                                fullWidth
                            >
                                Create exercise
                            </Button>
                        </Grid>
                    }
                    {
                        exercises.length > 0 ?
                            exercises.map((item) => (
                                <Grid key={item['id']} item xs={12} md={6}>
                                    <ExerciseItemPaper shortifyContent exercise={item}/>
                                </Grid>
                            )) :
                            <Grid item xs={12}>
                                <Typography >No results found.</Typography>
                            </Grid>
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
