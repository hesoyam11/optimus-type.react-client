import axios from "axios";
import React, { useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import clsx from "clsx";
import {
    AppBar,
    Badge,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    ListItemText,
} from '@material-ui/core';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import PeopleIcon from '@material-ui/icons/People';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
    createStyles({
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            // padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        title: {
            flexGrow: 1,
        },
        navLink: {
            textDecoration: 'none',
            color: 'black'
        }
    }),
);

const NavigationBar = (props) => {
    const classes = useStyles();
    const theme = useTheme();

    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = props.authToken !== null;

    const handleDrawerOpen = () => {
        setIsOpen(true);
    };

    const handleDrawerClose = () => {
        setIsOpen(false);
    };

    const handleSignOutClick = () => {
        axios.post(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/token/logout/`,
            null,
            {
                headers: {
                    "Authorization": `Token ${props.authToken}`
                }
            }
        )
            .then(() => {
                props.doSignOut();
            })
            .catch(() => {
                alert(
                    "Your existing session has seemed to be broken," +
                    " but we continue signing you out."
                );
                props.doSignOut();
            });
    };

    const activeRoute = (routeName) => {
        const pathname = props.location.pathname;
        if (routeName === "/") {
            return routeName === pathname;
        }
        return routeName === pathname || pathname.startsWith(`${routeName}/`);
    }

    return (
        <React.Fragment>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: isOpen,
                })}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: isOpen,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        Optimus Type
                    </Typography>
                    {
                        isAuthenticated &&
                            <React.Fragment>
                                <Typography>{props.username}</Typography>
                                <IconButton onClick={handleSignOutClick} color="inherit">
                                    <Badge color="secondary">
                                        <ExitToAppIcon />
                                    </Badge>
                                </IconButton>
                            </React.Fragment>
                    }
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: isOpen,
                    [classes.drawerClose]: !isOpen,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: isOpen,
                        [classes.drawerClose]: !isOpen,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <NavLink to="/" className={classes.navLink}>
                        <ListItem button selected={activeRoute("/")}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </NavLink>
                    <NavLink to="/exercises" className={classes.navLink}>
                        <ListItem button selected={activeRoute("/exercises")}>
                            <ListItemIcon><KeyboardIcon /></ListItemIcon>
                            <ListItemText primary="Exercises" />
                        </ListItem>
                    </NavLink>
                    <NavLink to="/users" className={classes.navLink}>
                        <ListItem button selected={activeRoute("/users")}>
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                    </NavLink>
                    <NavLink to="/demo" className={classes.navLink}>
                        <ListItem button selected={activeRoute("/demo")}>
                            <ListItemIcon><EmojiObjectsIcon /></ListItemIcon>
                            <ListItemText primary="DemoPage" />
                        </ListItem>
                    </NavLink>
                </List>
                <Divider />
                {
                    isAuthenticated ?
                        <NavLink to="/profile" className={classes.navLink}>
                            <ListItem button selected={activeRoute("/profile")}>
                                <ListItemIcon><AccountBoxIcon /></ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItem>
                        </NavLink> :
                        <List>
                            <NavLink to="/sign-in" className={classes.navLink}>
                                <ListItem button selected={activeRoute("/sign-in")}>
                                    <ListItemIcon><LockOpenIcon /></ListItemIcon>
                                    <ListItemText primary="Sign In" />
                                </ListItem>
                            </NavLink>
                            <NavLink to="/sign-up" className={classes.navLink}>
                                <ListItem button selected={activeRoute("/sign-up")}>
                                    <ListItemIcon><AssignmentIndIcon /></ListItemIcon>
                                    <ListItemText primary="Sign Up" />
                                </ListItem>
                            </NavLink>
                        </List>
                }
            </Drawer>
        </React.Fragment>
    );
};

export default withRouter(NavigationBar);
