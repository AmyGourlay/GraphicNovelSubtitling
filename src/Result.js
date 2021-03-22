import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
//import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from "@material-ui/core/CardActionArea";
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
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
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import leftArrow from './assets/arrow-80-256.png';
import rightArrow from './assets/arrow-57-256.png';
import whiteBox from './assets/box.png';
import {exportComponentAsJPEG, exportComponentAsPDF} from 'react-component-export-image';
import {useRef} from 'react';
import Paper from '@material-ui/core/Paper';

import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: true});

var imgUrl = {leftArrow};

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
    width: '100%',
  },
  comic: {
    width: 700
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
    paddingBottom: '3%',
    padding: '1%'
  },
  arrow: {
    blockSize: '1%',
    paddingTop: '20%',
    paddingBottom: '20%',
    outline: 'none',
  },
  heading: {
    WebkitTextFillColor: 'black'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  img: {
    // margin: 'auto',
    // display: 'block',
    // maxWidth: '100%',
    // maxHeight: '100%',
    // objectFit: 'cover'
  },
  title: {
    color: 'white',
    fontSize: 12,
    whiteSpace: 'normal !important',
    overflow: 'visible'
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    whiteSpace: 'normal !important'
  },
}));

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
  }
})(Typography);


export default function Album() {
  
  const componentRef = useRef();

  const classes = useStyles();
  const location = useLocation();

  const[pageReady, setPageReady] = useState(0);
  const[newLayout, setnewLayout] = useState(0);
  const[newPlacement, setnewPlacement] = useState(0);

  const {keyframe, subtitle, timestamp} = location.state;

  console.log("YO" + keyframe)
  console.log("YOYO" + subtitle)
  console.log("YOYOYO" + timestamp)

  const tileData = [];

  console.log("LENGTH: " + keyframe.length)
  console.log("LENGTH: " + timestamp.length)

  for (var i=0; i<(keyframe.length+1); i++)
  {
    tileData.push(undefined)
    console.log("IN ONE")
  }

  for (var i=0; i<timestamp.length; i++)
  {
    console.log("IN THREE")
    for (var j=0; j<keyframe.length; j++) {
      console.log("IN FOUR")
      if ((timestamp[i] >= j*2) && (timestamp[i] < (j+1)*2)) {
        while (tileData[j] != undefined) {
          j++
        }
        tileData.splice(j, 1, subtitle[i])
      }
      
    }
    console.log("IN TWO")
  }

  console.log("TILDATA" + tileData);

  const l1 = [1, 1, 1, 1, 1, 1]
  const l1_2 = [1, 1, 1, 1, 1, 1, 1, 1]
  const l2 = [2, 1, 1, 2]
  const l2_2 = [2, 1, 1, 2, 1, 1]
  const l3 = [2, 1, 1, 1, 1, 1, 2]
  let layout = []
  let col = 2
  let height = 190
  let width = 600

  if (newLayout == 0) {
    if (newPlacement == 0) {
      layout = l1_2
      height = 190
    }
    else if (newPlacement == 1)
    {
      layout = l1
      height = 250
    }
    col = 2
    width = 600
    console.log("SET LAYOUT1")
  }
  if (newLayout == 1) {
    if (newPlacement == 0) {
      layout = l2_2
      height = 190
    }
    else if (newPlacement == 1)
    {
      layout = l2
      height = 250
    }
    col = 2
    width = 600
    console.log("SET LAYOUT2")
  }
  if (newLayout == 2) {
    if (newPlacement == 0) {
      height = 250
    }
    else if (newPlacement == 1)
    {
      height = 250
    }
    layout = l3
    col = 3
    width = 700
    console.log("SET LAYOUT3")
  }

  let page = [];
  const final = [];
  const noOfPagesTemp = keyframe.length/layout.length
  const noOfPages = Math.ceil(noOfPagesTemp)

  for (var j=(noOfPages-noOfPages); j<noOfPages; j++) {
    for (var i=0; i<layout.length; i++) {
      final.push({
        img: keyframe[i+(j*layout.length)],
        text: tileData[i+(j*layout.length)],
        layout: layout[i]
      })
    console.log("LAYOUT: " * layout[i])
    }
    console.log("NOOFPAGES: " + noOfPages)
  }

  for (var i=(layout.length*pageReady); i<(layout.length*pageReady)+layout.length; i++) {
    console.log("FINAL: " * final[i])
    page.push(final[i])
  }

  const changePageForward = () => {
    if (pageReady == (noOfPages-1)) {
      setPageReady(pageReady);
    }
    else{
      setPageReady(pageReady+1);
    } 
  }
  
  const changePageBackward = () => {
    if (pageReady == 0) {
      setPageReady(pageReady);
    }
    else{
      setPageReady(pageReady-1);
    }
  }

  const layout1 = () => {
    setnewLayout(0)
    console.log("LAYOUT1")
  }

  const layout2 = () => {
    setnewLayout(1)
    console.log("LAYOUT2")
  }

  const layout3 = () => {
    setnewLayout(2)
    console.log("LAYOUT3")
  }

  const placement = () => {
    if (newPlacement == 0) {
      setnewPlacement(1)
      document.getElementById('grid1').style.display = 'none';
      document.getElementById('grid2').style.removeProperty('display');
    } 
    else if (newPlacement == 1) {
      setnewPlacement(0)
      document.getElementById('grid2').style.display = 'none';
      document.getElementById('grid1').style.removeProperty('display');
    }
    console.log("PLACEMENT" + newPlacement)
  }

  console.log("WE HERE NOW::" + tileData)
  console.log(tileData)

  return (

    <div className="App">
      <React.Fragment>
        <main>
          <Container className={classes.cardGrid} >
            <div className={classes.root} ref={componentRef}>
              <input type="image" id="image" className={classes.arrow} alt="Login" src={leftArrow} onClick={changePageBackward}></input>
              <GridList id="grid1" cellHeight={height} style={{width: width}} cols={col}>
              {page.map((page) => ( 
                <GridListTile cols={page.layout || 1}>
                  <img src={page.img}/>
                  <GridListTileBar  key={page.text}
                      title={page.text}
                      classes={{
                        root: classes.titleBar,
                        title: classes.title,
                      }}
                      style={{whiteSpace: 'normal !important', overflow: 'visible !important'}}
                    />
                  
                </GridListTile>
                ))}
                </GridList>
                <GridList id="grid2" style={{display: "none", width: width}} cellHeight={height} cols={col}>
                {page.map((page) => ( 
                <GridListTile key={page.text} cols={page.layout || 1}>
                      <Card variant="outlined" style={{border: 'none', borderRadius: 0, pointerEvents: 'none'}}>
                        <CardActionArea>
                          <CardMedia
                            style={{ height: 185 }}
                            image={page.img}
                            title={page.text}
                          />
                          <CardContent style={{ height: 68, backgroundColor: 'black'}}>
                            <WhiteTextTypography
                              variant="body2"
                              color="#fff !important"
                              component="p"
                            >
                              {page.text}
                            </WhiteTextTypography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </GridListTile>
                ))}
              </GridList>
              <input type="image" id="image" className={classes.arrow} alt="Login" src={rightArrow} onClick={changePageForward}></input>
            </div>
            <ListSubheader style={{textAlign: "center"}} className={classes.heading}>Page {pageReady+1} / {noOfPages}</ListSubheader>
            <Button variant="contained" color="primary" style={{marginRight: 5}} onClick={() => exportComponentAsJPEG(componentRef)} >
              Export As JPEG
            </Button>
            <Button variant="contained" color="primary" style={{marginRight: 5}} onClick={placement} >
              Subtitle Placement
            </Button>
            <Button variant="contained" color="primary" style={{marginRight: 5}} onClick={layout1} >
              Layout 1
            </Button>
            <Button variant="contained" color="primary" style={{marginRight: 5}} onClick={layout2} >
              Layout 2
            </Button>
            <Button variant="contained" color="primary" style={{marginRight: 5}} onClick={layout3} >
              Layout 3
            </Button>
          </Container>
        </main>
      </React.Fragment>
    </div>
  )
    
}