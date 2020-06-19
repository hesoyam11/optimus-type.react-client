import React from "react";
import {
    Container,
    Typography
} from "@material-ui/core";

export default function HomePage() {
    return (
        <Container component="main" maxWidth="md">
            <Typography variant="h2">
                Optimus Type
            </Typography>
            <Typography variant="h4">
                A web app for touch type training.
            </Typography>
        </Container>
    );
};
