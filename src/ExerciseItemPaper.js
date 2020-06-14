import {Divider, Paper, Typography} from "@material-ui/core";
import {localeFromInternalToHumanValue} from "./utils/localeUtils";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {NavLink} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
        '& a': {
            textDecoration: 'none'
        },
        padding: theme.spacing(3),
        width: "100%",
    }
}));

export default function ExerciseItemPaper(props) {
    const classes = useStyles();
    const exercise = props.exercise;

    let content = exercise['content'];
    if (props.shortifyContent) {
        content = content.slice(0, 256) + (content.length > 256 ? "..." : "");
    }

    return (
        <Paper className={classes.paper}>
            <NavLink to={`/exercises/${exercise['id']}`}>
                <Typography component="h2" variant="h5">
                    {exercise['title']}
                </Typography>
            </NavLink>
            <Divider />
            <Typography color="textSecondary">
                Locale: {localeFromInternalToHumanValue[exercise['locale']]}
            </Typography>
            <Typography color="textSecondary">
                Created by {exercise['creator']['username']} on {(new Date(exercise['createdAt'])).toDateString()}
            </Typography>
            <Typography>{content}</Typography>
        </Paper>
    );
};
