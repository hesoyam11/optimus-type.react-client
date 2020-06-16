import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography
} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";

import useFocus from "./utils/useFocus";
import VirtualText from "./VirtualText";
import VirtualKeyboard from "./VirtualKeyboard";


const useStyles = makeStyles(() =>
    createStyles({
        fakeHide: {
            height: 0,
            opacity: 0
        }
    }),
);

// {
//     "layout": "enUSAQ",
//     "exerciseId": 0,
//     "inputTimeLogs": [
//          0
//      ],
//     "mistakeTimeLogs": [
//          0
//      ],
//     "mistakeCharLogs": "string"
// }

export default function ExerciseTypePage(props) {
    const classes = useStyles();

    const { exerciseId } = useParams();

    const authToken = props.authToken;

    const [exercise, setExercise] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentMistakes, setCurrentMistakes] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const [inputTimeLogs, setInputTimeLogs] = useState([]);
    const [mistakeTimeLogs, setMistakeTimeLogs] = useState([]);
    const [mistakeCharLogs, setMistakeCharLogs] = useState("");
    const [isAttemptSent, setIsAttemptSent] = useState(false);

    const text = exercise ? exercise['content'] : "";

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

        if (currentMistakes.length === 0 && key === text[currentIndex]) {
            const newCurrentIndex = currentIndex + 1;
            const newInputTimeLogs = inputTimeLogs.concat((new Date()).getTime());
            setCurrentIndex(newCurrentIndex);
            setInputTimeLogs(newInputTimeLogs);

            // If the last character just has been entered.
            if (!(newCurrentIndex < text.length)) {
                setIsAttemptSent(true);
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
                            exerciseId,
                            layout: "enUSAQ",
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
        }
        else {
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
                setCurrentMistakes(
                    currentMistakes.concat(key)
                );
                setMistakeTimeLogs(
                    mistakeTimeLogs.concat((new Date()).getTime())
                );
                setMistakeCharLogs(
                    mistakeCharLogs.concat(key)
                );
            }
        }
    };

    return (
        <Container component="main" maxWidth="md">{
            isAttemptSent ? <Typography>Okay.</Typography> :
            exercise === null ? <Typography>Loading...</Typography> : <React.Fragment>
                <input
                    className={classes.fakeHide}
                    ref={inputRef}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                />
                <VirtualText
                    text={text}
                    currentIndex={currentIndex}
                    currentMistakes={currentMistakes}
                    isFocused={isInputFocused}
                    handleInputFocus={setInputRef}
                />
                <VirtualKeyboard nextChar={text[currentIndex]} />
            </React.Fragment>
        }</Container>
    );
};
