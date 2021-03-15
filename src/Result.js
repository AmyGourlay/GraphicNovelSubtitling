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
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import leftArrow from './assets/arrow-80-256.png';
import rightArrow from './assets/arrow-57-256.png';
import whiteBox from './assets/box.png';
import {exportComponentAsJPEG, exportComponentAsPDF} from 'react-component-export-image';
import {useRef} from 'react';




import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: true});

var imgUrl = {leftArrow};

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
    // backgroundColor: theme.palette.background.paper,
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
  },
  arrow: {
    blockSize: '1%',
    paddingTop: '20%',
    paddingBottom: '20%',
    outline: 'none'
  },
  heading: {
    WebkitTextFillColor: 'black'
  }
}));


export default function Album() {
  
  const componentRef = useRef();

  const classes = useStyles();
  const location = useLocation();

  const[pageReady, setPageReady] = useState(false);
  

  //const tileData = location.state;

  const {keyframe, subtitle, timestamp} = location.state;

  //const subtitle = location.state;

  console.log("YO" + keyframe)
  console.log("YOYO" + subtitle)
  console.log("YOYOYO" + timestamp)

  //console.log("TILEDATA2:" + tileData);

  //console.log("MATCH1:" + tileData.map((tile) => (tile.img)));

  const tileData = [];

  for (var i=0; i<12; i++)
  {
    tileData.push(undefined)
  }

  for (var i=0; i<16; i++)
  {
    //tileData.splice(i, 0, undefined)
    for (var j=0; j<16; j++) {
      if ((timestamp[i] >= j*2) && (timestamp[i] < (j+1)*2)) {
        tileData.splice(j, 0, subtitle[i])
      }
      
    }
  }

  const page1keyframes = []
  const page2keyframes = []
  

  for (var i=0; i<keyframe.length; i++)
  {
    if (i<8) {
      page1keyframes.push(keyframe[i]);
    }
    else {
      page2keyframes.push(keyframe[i]);
    }
  }

  let page = [];
  //console.log(page);
  //let page = [];

  if (pageReady == false) {
    page = page1keyframes.slice();
  }
  else if(pageReady == true) {
    page = page2keyframes.slice();
  }

  const changePage = () => {
    console.log("HERE");
    //page = page2keyframes.slice();
    console.log(page);
    //window.location.reload()
    if (pageReady == false)
    {
      setPageReady(true);
    }
    else {
      setPageReady(false);
    }
  }

  console.log("WE HERE NOW::" + tileData)
  console.log(tileData)

  return (

    <div className="App">
      {/* { video && <video
        controls
        width="250"
        src={URL.createObjectURL(video)}>

      </video>} */}

      <React.Fragment>
        <main>
          <Container className={classes.cardGrid} >
            <div className={classes.root} ref={componentRef}>
              <input type="image" id="image" className={classes.arrow} alt="Login" src={leftArrow}></input>
              <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                  <ListSubheader className={classes.heading} style={{textAlign: "center"}}>Your Graphic Novel</ListSubheader>
                </GridListTile>
                {/* {tileData.map((tile) => (
                  <GridListTile key={tile.img}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                      subtitle={tile.text}
                    />
                  </GridListTile>
                ))} */}
                {page.map((page) => ( 
                  <GridListTile key={page}>
                    <img src={page} /> 
                    {/* {subtitle.map((subtitle) => ( */}
                    <GridListTileBar key={subtitle}
                      subtitle={subtitle}
                    />
                      {/* ))} */}
                  </GridListTile>
                  ))}
              </GridList>
              <input type="image" id="image" className={classes.arrow} alt="Login" src={rightArrow} onClick={changePage}></input>
              {/* <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                  <ListSubheader component="div">Your Graphic Novel</ListSubheader>
                </GridListTile>
                {tileData.map((tile) => (
                  <GridListTile key={tile.img}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                      subtitle={tile.text}
                    />
                  </GridListTile>
                ))}
              </GridList> */}
            </div>
            
            <ListSubheader style={{textAlign: "center"}} className={classes.heading}>Page 1</ListSubheader>
            <Button variant="contained" color="primary" style={{justifyContent: "right"}} onClick={() => exportComponentAsJPEG(componentRef)} >
              Export As JPEG
            </Button>
          </Container>
       
        </main>
      </React.Fragment>
    </div>
  )
    
}