import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {NavLink} from "react-router-dom";
import {useParams} from 'react-router-dom';
import {
    Button,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slide,
    Typography
} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";

import layoutDescriptions from "./utils/layoutUtils";
import useFocus from "./utils/useFocus";
import VirtualText from "./VirtualText";
import VirtualKeyboard from "./VirtualKeyboard";


const useStyles = makeStyles(() =>
    createStyles({
        fakeHide: {
            height: 0,
            opacity: 0
        },
        infoPaper: {
            padding: 16
        }
    }),
);

export default function ExerciseTypePage(props) {
    const classes = useStyles();

    const {exerciseId} = useParams();

    const authToken = props.authToken;

    const [pressedChar, setPressedChar] = useState(null);

    const [exercise, setExercise] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentMistakes, setCurrentMistakes] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const [inputTimeLogs, setInputTimeLogs] = useState([]);
    const [mistakeTimeLogs, setMistakeTimeLogs] = useState([]);
    const [mistakeCharLogs, setMistakeCharLogs] = useState("");

    const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);

    const text = exercise ? exercise['content'] : "";
    const layoutOptions = exercise ? new Map([
        ["enUS", ["enUSAQ", "enUSAD", "enUSAC"]],
        ["ukUA", ["ukUAAЙ"]],
        ["ruRU", ["ruRUAЙ"]]
    ]).get(exercise['locale']) : [];

    const [layout, setLayout] = useState(undefined);
    const handleLayoutChange = event => setLayout(event.target.value);

    const timeSpentMs = inputTimeLogs.length > 1 ?
        inputTimeLogs[inputTimeLogs.length - 1] - inputTimeLogs[0] : 0;
    const cpm = timeSpentMs > 0 ?
        Math.round(inputTimeLogs.length / (timeSpentMs / (60 * 1000))) : 0;
    const tooManyErrors = (mistakeCharLogs.length > 32);

    useEffect(() => {
        if (exercise === null) {
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/exercises/${exerciseId}/`
            )
                .then(res => {
                    res.data['content'] = res.data['content'].replace('\r', '\n');
                    setExercise(res.data);
                    const locale = res.data['locale'];
                    setLayout(
                        new Map([
                            ["enUS", "enUSAQ"],
                            ["ukUA", "ukUAAЙ"],
                            ["ruRU", "ruRUAЙ"]
                        ]).get(locale)
                    );
                })
                .catch(error => {
                    alert("An error happened while loading the exercise.");
                    console.log(error);
                })
        }
    });

    const [inputRef, setInputRef] = useFocus();

    const handleInputFocus = () => setIsInputFocused(true);
    const handleInputBlur = () => setIsInputFocused(false);

    const handleKeyDown = (event) => {
        // Stop the character from being typed into the synthetic input field.
        event.preventDefault();

        // console.log(`Key: ${event.key}, Code: ${event.code}`);
        // console.log(event);
        // Object.keys(event).forEach((key) => {
        //     console.log(key, event[key]);
        // });

        // If the full text is finally entered.
        if (!(currentIndex < text.length)) {
            return;
        }

        let key = event.key;

        if (key === 'Enter') {
            key = '\n';
        }

        if (key === 'Tab') {
            key = '\t';
        }

        // Don't do anything if it is "Shift", "CapsLock", "Process", etc.
        if (key !== 'Backspace' && key.length > 1) {
            return;
        }

        setPressedChar(key);

        if (currentMistakes.length === 0 && key === text[currentIndex]) {
            const newCurrentIndex = currentIndex + 1;
            const newInputTimeLogs = inputTimeLogs.concat((new Date()).getTime());
            setPressedChar(null);
            setCurrentIndex(newCurrentIndex);
            setInputTimeLogs(newInputTimeLogs);

            // If the last character just has been entered.
            if (!(newCurrentIndex < text.length)) {
                setIsFinishDialogOpen(true);
                if (authToken !== null) {
                    // Make it start from zero.
                    const startTime = (
                        mistakeTimeLogs.length > 0 && mistakeTimeLogs[0] < newInputTimeLogs[0]
                    ) ? mistakeTimeLogs[0] : newInputTimeLogs[0];
                    const formattedInputTimeLogs = newInputTimeLogs.map(
                        value => value - startTime
                    );
                    const formattedMistakeTimeLogs = mistakeTimeLogs.map(
                        value => value - startTime
                    );
                    axios.post(
                        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/attempts/`,
                        {
                            exerciseId, layout,
                            inputTimeLogs: formattedInputTimeLogs,
                            mistakeTimeLogs: formattedMistakeTimeLogs,
                            mistakeCharLogs
                        },
                        {
                            headers: {
                                "Authorization": `Token ${authToken}`
                            }
                        }
                    )
                        .catch(error => {
                            alert("An error happened while saving your results.");
                            console.log(error);
                        });
                }
            }
        } else {
            // Backspace pressing is the only way to correct mistakes.
            if (key === 'Backspace') {
                // Do not backspace the already entered correct characters.
                if (currentMistakes.length > 0) {
                    setCurrentMistakes(
                        currentMistakes.slice(0, currentMistakes.length - 1)
                    );
                }
            }
            // Else treat the character as an input character.
            else if (currentIndex + currentMistakes.length < text.length) {
                const currentMistakesLength = currentMistakes.length;
                setCurrentMistakes(
                    currentMistakes.concat(key)
                );
                // If this is the first mistake in the row.
                if (currentMistakesLength === 0) {
                    setMistakeTimeLogs(
                        mistakeTimeLogs.concat((new Date()).getTime())
                    );
                    setMistakeCharLogs(
                        mistakeCharLogs.concat(key)
                    );
                }
            }
        }
    };

    const handleKeyUp = () => {
        setPressedChar(null);
    };

    const handleTryAgainClick = () => {
        setCurrentIndex(0);
        setCurrentMistakes([]);
        setIsInputFocused(false);
        setInputTimeLogs([]);
        setMistakeTimeLogs([]);
        setMistakeCharLogs("");
        setIsFinishDialogOpen(false);
    };

    return (
        <Container component="main" maxWidth="md">
            {
                exercise === null ? <Typography>Loading...</Typography> :
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <input
                                autoFocus
                                className={classes.fakeHide}
                                ref={inputRef}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                onKeyDown={handleKeyDown}
                                onKeyUp={handleKeyUp}
                            />
                            <VirtualText
                                text={text}
                                currentIndex={currentIndex}
                                currentMistakes={currentMistakes}
                                isFocused={isInputFocused}
                                handleInputFocus={setInputRef}
                            />
                        </Grid>
                        <Grid container spacing={2} item>
                            <Grid item xs={3}><Paper className={classes.infoPaper}>
                                <Typography>CPM: {cpm}</Typography>
                            </Paper></Grid>
                            <Grid item xs={6}>
                                {
                                    layout ? <FormControl
                                            disabled={(currentIndex !== 0)}
                                            variant="outlined" fullWidth
                                        >
                                            <InputLabel id="layout-select-label">Layout</InputLabel>
                                            <Select
                                                labelId="layout-select-label"
                                                id="layout-select"
                                                value={layout}
                                                onChange={handleLayoutChange}
                                                label="Layout"
                                            >
                                                {
                                                    layoutOptions.map(value => <MenuItem key={value} value={value}>
                                                        {layoutDescriptions.get(value)}
                                                    </MenuItem>)
                                                }
                                            </Select>
                                        </FormControl> :
                                        <Typography>Loading...</Typography>
                                }
                            </Grid>
                            <Grid item xs={3}><Paper className={classes.infoPaper}>
                                <Typography>Errors: {mistakeCharLogs.length}</Typography>
                            </Paper></Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <VirtualKeyboard
                                nextChar={text[currentIndex]}
                                pressedChar={pressedChar}
                                layout={layout}
                            />
                        </Grid>
                    </Grid>
            }
            <Dialog
                open={isFinishDialogOpen || tooManyErrors}
                // Produces warnings because of Material-UI's usage of findDOMNode
                // deprecated by React :(
                TransitionComponent={Slide} TransitionProps={{direction: "up"}}
                keepMounted
            >
                <DialogTitle>{
                    tooManyErrors ? "Oops..." : "Congratulations!"
                }</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {
                            (mistakeCharLogs.length > 32) ?
                                "You've made too many errors!" :
                                `Your score is ${timeSpentMs} ms!`
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleTryAgainClick}>
                        Try Again
                    </Button>
                    <Button color="primary" component={NavLink} to={`/exercises/${exerciseId}`}>
                        Go to exercise page
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
