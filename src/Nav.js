import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    linkColour: {
      color: 'white !important',
      '@media print' : {
        display: 'none'
      }
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
            <Link className={classes.linkColour} to="/" exact>
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
