import React, {useState, useEffect} from 'react';
import {createStyles, makeStyles} from "@material-ui/core/styles";


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
        exerciseTextDiv: {
            whiteSpace: "pre-wrap"
        },
        notFocusedDiv: {
            backgroundColor: 'gray'
        }
    }),
);

export default function VirtualText(props) {
    const classes = useStyles();

    const text = props.text;
    const currentIndex = props.currentIndex;
    const currentMistakes = props.currentMistakes;
    const isFocused = props.isFocused;
    const handleInputFocus = props.handleInputFocus;

    const [isCursorShown, setIsCursorShown] = useState(true);

    useEffect(() => {
        const intervalID = setInterval(() => {
            setIsCursorShown(!isCursorShown);
        }, 500);
        return () => clearInterval(intervalID);
    });

    const makeCharSpan = (char, index) => {
        const primaryClassName = classes.charSpan;
        let secondaryClassName = "";

        if (index < currentIndex) {
            secondaryClassName = classes.correctCharSpan;
        } else if (index < currentIndex + currentMistakes.length) {
            secondaryClassName = classes.mistakeCharSpan;
        } else if (isCursorShown && index === currentIndex + currentMistakes.length) {
            secondaryClassName = classes.cursorCharSpan;
        }

        const className = [primaryClassName, secondaryClassName].join(" ");

        return (
            <span key={index} className={className}>
                {
                    (index >= currentIndex && index < currentIndex + currentMistakes.length) ?
                        currentMistakes[index - currentIndex] :
                        char
                }
            </span>
        )
    };

    return (
        <div
            className={[
                classes.exerciseTextDiv,
                (isFocused) ? "" : classes.notFocusedDiv
            ].join(" ")}
            onClick={handleInputFocus}
        >
            {
                text.split("").map((char, index) => (
                    makeCharSpan(char, index)
                ))
            }
        </div>
    );
};
