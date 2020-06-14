import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography
} from "@material-ui/core";

import UserItemPaper from "./UserItemPaper";


export default function UserDetailPage() {
    const { user_id } = useParams();

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (user === null) {
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/users/${user_id}/`
            )
                .then(res => {
                    setUser(res.data);
                })
                .catch(error => {
                    alert("An error happened while loading the user info.");
                    console.log(error);
                })
        }
    });

    return (
        <Container component="main" maxWidth="md">{
            (user === null) ?
                <Typography>Loading...</Typography> :
                <UserItemPaper user={user} />
        }</Container>
    );
};
