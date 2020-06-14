import React from "react";
import {NavLink} from "react-router-dom";
import {Divider, Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    paper: {
        '& a': {
            textDecoration: 'none'
        },
        padding: theme.spacing(3),
        width: "100%",
    }
}));

export default function UserItemPaper(props) {
    const classes = useStyles();
    const user = props.user;

    return (
        <Paper className={classes.paper}>
            <NavLink to={`/users/${user['id']}`}>
                <Typography component="h2" variant="h5">
                    {user['username']}
                </Typography>
            </NavLink>
            <Divider />
            <Typography variant="h6">
                {user['firstName']} {user['lastName']}
            </Typography>
        </Paper>
    );
};
