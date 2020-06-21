import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {
    Container,
    Divider,
    Grid,
    Paper,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import layoutDescriptions from "./utils/layoutUtils";
import UserItemPaper from "./UserItemPaper";


const useStyles = makeStyles((theme) => ({
    paper: {
        '& a': {
            textDecoration: 'none'
        },
        padding: theme.spacing(3),
        width: "100%",
    }
}));

export default function UserDetailPage(props) {
    const classes = useStyles();

    let {userId} = useParams();
    if (!userId) {
        userId = props.userId;
    }

    const [user, setUser] = useState(null);
    const [isGetUserRequestSent, setIsGetUserRequestSent] = useState(false);
    const [layoutStats, setLayoutStats] = useState(null);
    const [isGetLayoutStatsRequestSent, setIsGetLayoutStatsRequestSent] = useState(false);

    useEffect(() => {
        if (!isGetUserRequestSent) {
            setIsGetUserRequestSent(true);
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/users/${userId}/`
            )
                .then(res => {
                    setUser(res.data);
                })
                .catch(error => {
                    alert("An error happened while loading the user info.");
                    console.log(error);
                })
        }
    }, [isGetUserRequestSent, userId]);

    useEffect(() => {
        if (!isGetLayoutStatsRequestSent) {
            setIsGetLayoutStatsRequestSent(true);
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/layout-statistics/`,
                {
                    params: {
                        user: userId,
                        ordering: 'layout'
                    }
                }
            )
                .then(res => {
                    setLayoutStats(res.data['results']);
                })
                .catch(error => {
                    alert("An error happened while loading layout statistics.");
                    console.log(error);
                });
        }
    }, [isGetLayoutStatsRequestSent, userId]);

    return (
        <Container component="main" maxWidth="md">{
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {
                        (user === null) ?
                            <Typography>Loading...</Typography> :
                            <UserItemPaper user={user}/>
                    }
                </Grid>
                {
                    (layoutStats === null) ?
                        <Grid item xs={12}>
                            <Typography>Loading...</Typography>
                        </Grid> :
                        <Grid item container spacing={2}>
                            {
                                layoutStats.map(value => <Grid key={value['id']} item xs={12} md={4}>
                                    <Paper className={classes.paper}>
                                        <Typography component="h3" variant="h6">
                                            {layoutDescriptions.get(value['layout'])}
                                        </Typography>
                                        <Divider/>
                                        <Typography>Accuracy: {
                                            (100 * value['inputCounter'] / (
                                                value['inputCounter'] + value['mistakeCounter']
                                            )).toFixed(2)
                                        }%</Typography>
                                        <Typography>CPM (chars per min): {
                                            (1000 * 60 * value['inputCounter'] / value['delayCounter']).toFixed(0)
                                        }</Typography>
                                        <Typography>Total Attempts: {
                                            value['attemptCounter']
                                        }</Typography>
                                        <Typography>Total Chars Entered: {
                                            value['inputCounter']
                                        }</Typography>
                                        <Typography>Total Mistakes: {
                                            value['mistakeCounter']
                                        }</Typography>
                                    </Paper>
                                </Grid>)
                            }
                        </Grid>
                }
            </Grid>
        }</Container>
    );
};
