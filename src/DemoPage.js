import React, { useEffect, useState } from 'react';
import {
    Container
} from '@material-ui/core';
import { createStyles, makeStyles } from "@material-ui/core/styles";


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

export default function DemoPage() {
    const classes = useStyles();

    const demoText = "Lorem   Ipsum is simply dummy text of the printing " +
        "and typesetting industry. Lorem Ipsum has been the industry's " +
        "standard dummy text ever since the 1500s, when an unknown printer " +
        "took a galley of type and scrambled it to make a type specimen book. " +
        "It has survived not only five centuries, but also the leap into " +
        "electronic typesetting, remaining essentially unchanged. It was " +
        "popularised in the 1960s with the release of Letraset sheets " +
        "containing Lorem Ipsum passages, and more recently with desktop " +
        "publishing software like Aldus PageMaker including versions of " +
        "Lorem Ipsum.";

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

        //console.log(`Key: ${event.key}, Code: ${event.code}`);
        console.log(event);
        Object.keys(event).forEach((key) => {
            console.log(key, event[key]);
        });

        // If the full text is finally entered.
        if (!(currentIndex < demoText.length)) {
            return;
        }

        const key = event.key;

        if (key === 'Shift' || key === 'Process') {
            return;
        }

        if (currentMistakes.length === 0 && key === demoText[currentIndex]) {
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
            else if (currentIndex + currentMistakes.length < demoText.length) {
                setCurrentMistakes(
                    currentMistakes.concat(key)
                );
            }
        }
    };

    return (
        <Container component="main" maxWidth="md">
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
                    demoText.split("").map((char, index) => (
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
            <VirtualKeyboard nextChar={demoText[currentIndex]}/>
        </Container>
    );
};
