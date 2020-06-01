import React, { useState } from 'react';
import {
    Container
} from '@material-ui/core';
import { createStyles, makeStyles } from "@material-ui/core/styles";


import useFocus from "./utils/useFocus";


const useStyles = makeStyles(() =>
    createStyles({
        charSpan: {
            fontFamily: "Monospace",
            fontSize: 18
        },
        correctCharSpan: {
            backgroundColor: 'green'
        },
        hide: {
            display: 'none',
        },
        notFocusedDiv: {
            backgroundColor: 'gray'
        }
    }),
);

export default function Demo() {
    const classes = useStyles();

    const demoText = "Lorem Ipsum is simply dummy text of the printing " +
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
    const demoTextLength = demoText.length;

    const [isDemoInputFocused, setIsDemoInputFocused] = useState(false);
    const [demoInputRef, setDemoInputFocus] = useFocus();

    const handleDemoInputFocus = () => {
        setIsDemoInputFocused(true);
    };

    const handleDemoInputBlur = () => {
        setIsDemoInputFocused(false);
    };

    const handleKeyPress = (event) => {
        const key = event.key;
        console.log(key);
        if (currentIndex < demoTextLength && demoText[currentIndex] === key) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <input
                ref={demoInputRef}
                onFocus={handleDemoInputFocus}
                onBlur={handleDemoInputBlur}
                onKeyPress={handleKeyPress}
            />
            <div
                className={
                    isDemoInputFocused ? null : classes.notFocusedDiv
                }
                onClick={setDemoInputFocus}
            >
                {
                    demoText.split("").map((char, index) => (
                        <span
                            key={index}
                            className={[
                                classes.charSpan,
                                (index < currentIndex) ? classes.correctCharSpan : ""
                            ].join(" ")}
                        >
                            {char}
                        </span>
                    ))
                }
            </div>
        </Container>
    );
};
