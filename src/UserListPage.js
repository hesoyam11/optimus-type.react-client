import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
    Button,
    Container,
    Grid, TextField, Typography
} from "@material-ui/core";
import UserItemPaper from "./UserItemPaper";
import SearchIcon from "@material-ui/icons/Search";


export default function UserListPage() {
    const [usernameSearchTerm, setUsernameSearchTerm] = useState("");
    const handleUsernameSearchTermChange = (event) => {
        setUsernameSearchTerm(event.target.value);
    };

    const [users, setUsers] = useState(null);
    const [nextPageLink, setNextPageLink] = useState(null);

    const updateSearchResults = () => {
        const queryParams = {
            ordering: 'username'
        };

        if (usernameSearchTerm !== "") {
            queryParams['search'] = usernameSearchTerm;
        }

        axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/users/`,
            {
                params: queryParams
            }
        )
            .then(res => {
                setUsers(res.data['results']);
                setNextPageLink(res.data['next']);
            })
            .catch(error => {
                alert("An error happened while loading users.");
                console.log(error);
            });
    };

    useEffect(() => {
        if (users === null) {
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
                setUsers(users.concat(res.data['results']));
                setNextPageLink(res.data['next']);
            })
            .catch(error => {
                alert("An error happened while loading users.");
                console.log(error);
            });
    };

    return (
        <Container component="main" maxWidth="md">{
            users === null ? <Typography>Loading...</Typography> :
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <form>
                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <TextField
                                        id="search-by-username"
                                        name="search-by-username"
                                        label="Search by username"
                                        type="search"
                                        value={usernameSearchTerm}
                                        onChange={handleUsernameSearchTermChange}
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
                            </Grid>
                        </form>
                    </Grid>
                    {
                        users.length > 0 ?
                            users.map((item) => (
                                <Grid key={item['id']} item xs={12} md={6}>
                                    <UserItemPaper user={item}/>
                                </Grid>
                            )) :
                            <Grid item xs={12}>
                                <Typography>No results found.</Typography>
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
