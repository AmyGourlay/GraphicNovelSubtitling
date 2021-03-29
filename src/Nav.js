import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Link} from 'react-router-dom';
import { withTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    linkColour: {
      color: 'white !important',
    //   '&&&:before': {
    //   borderBottom: "none"
    //     }
    },
}));

export default function Album() {
  const classes = useStyles();

  return (

    <div className="App">
      
      <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            {/* <CameraIcon className={classes.icon} /> */}
            <Link className={classes.linkColour} to="/">
                <Typography variant="h6" color="white" noWrap>
                Graphic Novel Subtitling
                </Typography>
            </Link>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    </div>
  )
    
}
