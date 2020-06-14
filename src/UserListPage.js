import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Grid
} from "@material-ui/core";
import UserItemPaper from "./UserItemPaper";


export default function UserListPage() {
    const [users, setUsers] = useState(null);
    const [nextPageLink, setNextPageLink] = useState(null);

    useEffect(() => {
        if (users === null) {
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/users/`
            )
                .then(res => {
                    setUsers(res.data['results']);
                    setNextPageLink(res.data['next']);
                })
                .catch(error => {
                    alert("An error happened while loading users.");
                    console.log(error);
                })
        }
    });

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
            })
    };

    return (
        <Container component="main" maxWidth="md">
            <Grid container spacing={2}>
                {users !== null && users.map((item) => (
                    <Grid key={item['id']} item xs={12} md={6}>
                        <UserItemPaper user={item} />
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
