import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
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
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            Graphic Novel Subtitling
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            By Amy Gourlay, University of Dundee
          </Typography>
        </footer>
        {/* End footer */}
      </React.Fragment>
    </div>
  )  
}
