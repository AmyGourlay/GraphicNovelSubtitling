import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
//import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MLink from '@material-ui/core/Link';
import ButtonBase from '@material-ui/core/ButtonBase';
import backgroundImage from './assets/backgroundImage.jpg';
import attachImage from './assets/attach-2-256.png';
import uploadImage from './assets/upload-3-256.png';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
//import {parseSync} from 'subtitle';
//import fs from 'fs';
import SubtitleFile from './assets/DWSubtitles.srt';
import parseSRT from 'parse-srt';
import Result from './Result';
import Upload from './Upload';
import Nav from './Nav';
import Footer from './Footer';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Link} from 'react-router-dom';

// import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
// const ffmpeg = createFFmpeg({log: true});

// const msgArr = [];

// //ffmpeg.setLogging(true);
// ffmpeg.setLogger(({ message }) => {
//     console.log("MESSAGE:::" + message);
//     msgArr.push(message);
//     /*
//      * type can be one of following:
//      *
//      * info: internal workflow debug messages
//      * fferr: ffmpeg native stderr output
//      * ffout: ffmpeg native stdout output
//      */
//   });

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(20),
    backgroundImage: 'url(${"backgroundImage"})',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  image: {
    paddingTop: '5%',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 600,
    height: 790,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  button: {
    paddingTop: '3%',
    paddingBottom: '3%'
  }
}));



export default function Album() {
  const classes = useStyles();

  return (

    <div className="App">
      <Router>
      <React.Fragment>
        <CssBaseline />
        <Route path="/" component={Nav} />
        <main>
          <Route path="/" exact component={Upload} />
          <Route path="/result" component={Result} />
        </main>
        <Route path="/" component={Footer} />
      </React.Fragment>
      </Router>
    </div>
  )
    
}

{/* <Router>
  <Route path="/result" component={Result} />
  <Link to="/result">
    <Button variant="contained" color="primary" style={{justifyContent: 'center'}}>
      Move
    </Button>
  </Link>    
</Router> */}
