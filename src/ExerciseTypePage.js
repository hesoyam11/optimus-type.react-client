import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography
} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import useFocus from "./utils/useFocus";
import VirtualKeyboard from "./VirtualKeyboard";


const useStyles = makeStyles(() =>
    createStyles({
        charSpan: {
            fontFamily: "Monospace",
            fontSize: 18
        },
        correctCharSpan: {
            backgroundColor: 'green'
        },
        mistakeCharSpan: {
            backgroundColor: 'red'
        },
        cursorCharSpan: {
            backgroundColor: 'black',
            color: 'white'
        },
        fakeHide: {
            height: 0,
            opacity: 0
        },
        exerciseTextDiv: {
            whiteSpace: "pre-wrap"
        },
        notFocusedDiv: {
            backgroundColor: 'gray'
        }
    }),
);

export default function ExerciseTypePage() {
    const classes = useStyles();

    const { exercise_id } = useParams();

    const [exercise, setExercise] = useState(null);
    const text = exercise ? exercise['content'] : "";

    useEffect(() => {
        if (exercise === null) {
            axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/v1.0/exercises/${exercise_id}/`
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

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentMistakes, setCurrentMistakes] = useState([]);
    const [isDemoInputFocused, setIsDemoInputFocused] = useState(false);
    const [isCursorShown, setIsCursorShown] = useState(true);

    useEffect(() => {
        const intervalID = setInterval(() => {
            setIsCursorShown(!isCursorShown);
        }, 500);
        return () => clearInterval(intervalID);
    });

    const [demoInputRef, setDemoInputFocus] = useFocus();

    const handleDemoInputFocus = () => {
        setIsDemoInputFocused(true);
    };

    const handleDemoInputBlur = () => {
        setIsDemoInputFocused(false);
    };

    const handleKeyDown = (event) => {
        // Stop the character from being typed into the synthetic input field.
        event.preventDefault();

        // console.log(`Key: ${event.key}, Code: ${event.code}`);
        console.log(event);
        Object.keys(event).forEach((key) => {
            console.log(key, event[key]);
        });

        // If the full text is finally entered.
        if (!(currentIndex < text.length)) {
            return;
        }

        const key = event.key;

        if (key === 'Shift' || key === 'CapsLock' || key === 'Process') {
            return;
        }

        if (currentMistakes.length === 0 && key === text[currentIndex]) {
            setCurrentIndex(currentIndex + 1);
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
            }
        }
    };

    return (
        <Container component="main" maxWidth="md">{
            exercise === null ? <Typography>Loading...</Typography> : <React.Fragment>
                <input
                    className={classes.fakeHide}
                    ref={demoInputRef}
                    onFocus={handleDemoInputFocus}
                    onBlur={handleDemoInputBlur}
                    onKeyDown={handleKeyDown}
                />
                <div
                    className={[
                        classes.exerciseTextDiv,
                        (isDemoInputFocused) ? "" : classes.notFocusedDiv
                    ].join(" ")}
                    onClick={setDemoInputFocus}
                >
                    {
                        text.split("").map((char, index) => (
                            <span
                                key={index}
                                className={[
                                    classes.charSpan,
                                    (index < currentIndex) ?
                                        classes.correctCharSpan : (
                                            (index < currentIndex + currentMistakes.length) ?
                                                classes.mistakeCharSpan : (
                                                    (isCursorShown && index === currentIndex + currentMistakes.length) ?
                                                        classes.cursorCharSpan : ""
                                                )
                                        )
                                ].join(" ")}
                            >
                        {
                            (index >= currentIndex && index < currentIndex + currentMistakes.length) ?
                                currentMistakes[index - currentIndex] :
                                char
                        }
                    </span>
                        ))
                    }
                </div>
                <VirtualKeyboard nextChar={text[currentIndex]}/>
            </React.Fragment>
        }</Container>
    );
};
