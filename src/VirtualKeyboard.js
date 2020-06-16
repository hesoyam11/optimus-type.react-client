import React from 'react';
import { createStyles, makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(() =>
    createStyles({
        keyRect: {
            fill: "none",
            stroke: "black",
            strokeWidth: 2
        },
        hintKeyRect: {
            fill: "rgb(63, 81, 181)"
        },
        keyText: {
            fontSize: "20px",
            fontFamily: "Roboto, sans-serif"
        }
    }),
);

function buildTranslateString(x, y) {
    return `translate(${x},${y})`;
}

function SquareKeyRect(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <rect
                x="3" y="3" rx="6" ry="6"
                width="56" height="56"
                className={[
                    classes.keyRect,
                    props.isHinted ? classes.hintKeyRect : ""
                ].join(" ")}
            />
            {
                props.additionalChar ?
                    <React.Fragment>
                        <text x="15" y="24" className={classes.keyText}>{props.additionalChar}</text>
                        <text x="15" y="50" className={classes.keyText}>{props.mainChar}</text>
                    </React.Fragment> :
                    <text x="15" y="26" className={classes.keyText}>{props.mainChar}</text>
            }
        </React.Fragment>
    );
}

export default function VirtualKeyboard(props) {

    const nextChar = props.nextChar;

    const classes = useStyles();

    return (
    <React.Fragment>
        <svg
            width="100%"
            viewBox="0 0 912 310"
        >
            <g transform={buildTranslateString(0, 0)}><SquareKeyRect isHinted={nextChar === "`" || nextChar === "~"} mainChar='`' additionalChar='~' /></g>
            <g transform={buildTranslateString(62, 0)}><SquareKeyRect isHinted={nextChar === "1" || nextChar === "!"} mainChar="1" additionalChar="!"/></g>
            <g transform={buildTranslateString(2 * 62, 0)}><SquareKeyRect isHinted={nextChar === "2" || nextChar === "@"} mainChar="2" additionalChar="@" /></g>
            <g transform={buildTranslateString(3 * 62, 0)}><SquareKeyRect isHinted={nextChar === "3" || nextChar === "#"} mainChar="3" additionalChar="#" /></g>
            <g transform={buildTranslateString(4 * 62, 0)}><SquareKeyRect isHinted={nextChar === "4" || nextChar === "$"} mainChar="4" additionalChar="$" /></g>
            <g transform={buildTranslateString(5 * 62, 0)}><SquareKeyRect isHinted={nextChar === "5" || nextChar === "%"} mainChar="5" additionalChar="%" /></g>
            <g transform={buildTranslateString(6 * 62, 0)}><SquareKeyRect isHinted={nextChar === "6" || nextChar === "^"} mainChar="6" additionalChar="^" /></g>
            <g transform={buildTranslateString(7 * 62, 0)}><SquareKeyRect isHinted={nextChar === "7" || nextChar === "&"} mainChar="7" additionalChar="&" /></g>
            <g transform={buildTranslateString(8 * 62, 0)}><SquareKeyRect isHinted={nextChar === "8" || nextChar === "*"} mainChar="8" additionalChar="*" /></g>
            <g transform={buildTranslateString(9 * 62, 0)}><SquareKeyRect isHinted={nextChar === "9" || nextChar === "("} mainChar="9" additionalChar="(" /></g>
            <g transform={buildTranslateString(10 * 62, 0)}><SquareKeyRect isHinted={nextChar === "0" || nextChar === ")"} mainChar="0" additionalChar=")" /></g>
            <g transform={buildTranslateString(11 * 62, 0)}><SquareKeyRect isHinted={nextChar === "-" || nextChar === "_"} mainChar="-" additionalChar="_" /></g>
            <g transform={buildTranslateString(12 * 62, 0)}><SquareKeyRect isHinted={nextChar === "=" || nextChar === "+"} mainChar="=" additionalChar="+" /></g>
            <g transform={buildTranslateString(13 * 62, 0)}>
                <rect x="3" y="3" rx="6" ry="6" width="102" height="56" className={classes.keyRect} />
                <text x="46" y="40" className={classes.keyText}>←</text>
            </g>

            <g transform={buildTranslateString(0, 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="88" height="56" className={classes.keyRect} />
                <text x="15" y="40" className={classes.keyText}>Tab</text>
            </g>
            <g transform={buildTranslateString(94, 62)}><SquareKeyRect isHinted={nextChar === "q" || nextChar === "Q"} mainChar="Q" /></g>
            <g transform={buildTranslateString(94 + 62, 62)}><SquareKeyRect isHinted={nextChar === "w" || nextChar === "W"} mainChar="W" /></g>
            <g transform={buildTranslateString(94 + 2 * 62, 62)}><SquareKeyRect isHinted={nextChar === "e" || nextChar === "E"} mainChar="E" /></g>
            <g transform={buildTranslateString(94 + 3 * 62, 62)}><SquareKeyRect isHinted={nextChar === "r" || nextChar === "R"} mainChar="R" /></g>
            <g transform={buildTranslateString(94 + 4 * 62, 62)}><SquareKeyRect isHinted={nextChar === "t" || nextChar === "T"} mainChar="T" /></g>
            <g transform={buildTranslateString(94 + 5 * 62, 62)}><SquareKeyRect isHinted={nextChar === "y" || nextChar === "Y"} mainChar="Y" /></g>
            <g transform={buildTranslateString(94 + 6 * 62, 62)}><SquareKeyRect isHinted={nextChar === "u" || nextChar === "U"} mainChar="U" /></g>
            <g transform={buildTranslateString(94 + 7 * 62, 62)}><SquareKeyRect isHinted={nextChar === "i" || nextChar === "I"} mainChar="I" /></g>
            <g transform={buildTranslateString(94 + 8 * 62, 62)}><SquareKeyRect isHinted={nextChar === "o" || nextChar === "O"} mainChar="O" /></g>
            <g transform={buildTranslateString(94 + 9 * 62, 62)}><SquareKeyRect isHinted={nextChar === "p" || nextChar === "P"} mainChar="P" /></g>
            <g transform={buildTranslateString(94 + 10 * 62, 62)}><SquareKeyRect isHinted={nextChar === "[" || nextChar === "{"} mainChar="[" additionalChar="{" /></g>
            <g transform={buildTranslateString(94 + 11 * 62, 62)}><SquareKeyRect isHinted={nextChar === "]" || nextChar === "}"} mainChar="]" additionalChar="}" /></g>
            <g transform={buildTranslateString(94 + 12 * 62, 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="68" height="56" className={classes.keyRect} />
                <text x="15" y="24" className={classes.keyText}>|</text>
                <text x="15" y="50" className={classes.keyText}>\</text>
            </g>

            <g transform={buildTranslateString(0, 2 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="109" height="56" className={classes.keyRect} />
                <text x="10" y="40" className={classes.keyText}>Caps Lock</text>
            </g>
            <g transform={buildTranslateString(115, 2 * 62)}><SquareKeyRect isHinted={nextChar === "a" || nextChar === "A"} mainChar="A" /></g>
            <g transform={buildTranslateString(115 + 62, 2 * 62)}><SquareKeyRect isHinted={nextChar === "s" || nextChar === "S"} mainChar="S"/></g>
            <g transform={buildTranslateString(115 + 2 * 62, 2 * 62)}><SquareKeyRect isHinted={nextChar === "d" || nextChar === "D"} mainChar="D" /></g>
            <g transform={buildTranslateString(115 + 3 * 62, 2 * 62)}><SquareKeyRect isHinted={nextChar === "f" || nextChar === "F"} mainChar="F" /></g>
            <g transform={buildTranslateString(115 + 4 * 62, 2 * 62)}><SquareKeyRect isHinted={nextChar === "g" || nextChar === "G"} mainChar="G" /></g>
            <g transform={buildTranslateString(115 + 5 * 62, 2 * 62)}><SquareKeyRect isHinted={nextChar === "h" || nextChar === "H"} mainChar="H" /></g>
            <g transform={buildTranslateString(115 + 6 * 62, 2 * 62)}><SquareKeyRect isHinted={nextChar === "j" || nextChar === "J"} mainChar="J" /></g>
            <g transform={buildTranslateString(115 + 7 * 62, 2 * 62)}><SquareKeyRect isHinted={nextChar === "k" || nextChar === "K"} mainChar="K" /></g>
            <g transform={buildTranslateString(115 + 8 * 62, 2 * 62)}><SquareKeyRect isHinted={nextChar === "l" || nextChar === "L"} mainChar="L" /></g>
            <g transform={buildTranslateString(115 + 9 * 62, 2 * 62)}><SquareKeyRect mainChar=";" additionalChar=":" /></g>
            <g transform={buildTranslateString(115 + 10 * 62, 2 * 62)}><SquareKeyRect mainChar="'" additionalChar='"' /></g>
            <g transform={buildTranslateString(115 + 11 * 62, 2 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="109" height="56" className={classes.keyRect} />
                <text x="15" y="40" className={classes.keyText}>Enter</text>
            </g>

            {/* TODO: isHinted prop and a lot of refactoring... */}
            <g transform={buildTranslateString(0, 3 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="140" height="56" className={classes.keyRect} />
                <text x="15" y="40" className={classes.keyText}>Shift</text>
            </g>
            <g transform={buildTranslateString(146, 3 * 62)}><SquareKeyRect mainChar="Z" /></g>
            <g transform={buildTranslateString(146 + 62, 3 * 62)}><SquareKeyRect mainChar="X" /></g>
            <g transform={buildTranslateString(146 + 2 * 62, 3 * 62)}><SquareKeyRect mainChar="C" /></g>
            <g transform={buildTranslateString(146 + 3 * 62, 3 * 62)}><SquareKeyRect mainChar="V" /></g>
            <g transform={buildTranslateString(146 + 4 * 62, 3 * 62)}><SquareKeyRect mainChar="B" /></g>
            <g transform={buildTranslateString(146 + 5 * 62, 3 * 62)}><SquareKeyRect mainChar="N" /></g>
            <g transform={buildTranslateString(146 + 6 * 62, 3 * 62)}><SquareKeyRect mainChar="M" /></g>
            <g transform={buildTranslateString(146 + 7 * 62, 3 * 62)}><SquareKeyRect mainChar="," additionalChar="<" /></g>
            <g transform={buildTranslateString(146 + 8 * 62, 3 * 62)}><SquareKeyRect mainChar="." additionalChar=">" /></g>
            <g transform={buildTranslateString(146 + 9 * 62, 3 * 62)}><SquareKeyRect mainChar="/" additionalChar="?" /></g>
            <g transform={buildTranslateString(146 + 10 * 62, 3 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="140" height="56" className={classes.keyRect} />
                <text x="15" y="40" className={classes.keyText}>Shift</text>
            </g>

            <g transform={buildTranslateString(0, 4 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="90" height="56" className={classes.keyRect} />
                <text x="15" y="40" className={classes.keyText}>Ctrl</text>
            </g>
            <g transform={buildTranslateString(96, 4 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="72" height="56" className={classes.keyRect} />
            </g>
            <g transform={buildTranslateString(96 + 78, 4 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="90" height="56" className={classes.keyRect} />
            </g>
            <g transform={buildTranslateString(96 + 78 + 96, 4 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="366" height="56" className={classes.keyRect} />
            </g>
            <g transform={buildTranslateString(96 + 78 + 96 + 372, 4 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="90" height="56" className={classes.keyRect} />
            </g>
            <g transform={buildTranslateString(96 + 78 + 96 + 372 + 96, 4 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="72" height="56" className={classes.keyRect} />
            </g>
            <g transform={buildTranslateString(96 + 78 + 96 + 372 + 96 + 78, 4 * 62)}>
                <rect x="3" y="3" rx="6" ry="6" width="90" height="56" className={classes.keyRect} />
                <text x="15" y="40" className={classes.keyText}>Ctrl</text>
            </g>
        </svg>
    </React.Fragment>
);
}