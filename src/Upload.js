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
import Paper from '@material-ui/core/Paper';
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
import {useHistory} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';

import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: true});

//const ffLog = require("../node_modules/@ffmpeg/ffmpeg/src/utils/log.js");

const msgArr = [];

//ffmpeg.setLogging(true);
ffmpeg.setLogger(({ type, message }) => {
    console.log("MESSAGE:::" + message);
    //if(type == 'fferr')
    if(message.includes("frame="))
    {
        var frameTemp = message.substring(
            message.lastIndexOf("frame"), 
            message.lastIndexOf("fps")
        );
        var frame = frameTemp.match(/\d+/)
        msgArr.splice(0, 1, frame);
    }
  });


// let logging = false;
// let myLogger = () => {};

// const setLogging = (_logging) => {
//   logging = _logging;
// };

// const setCustomLogger = (logger) => {
//   myLogger = logger;
// };

// const log = (type, message) => {
//   myLogger({ type, message });
//   if (logging) {
//     console.log(`MyLogger: [${type}] ${message}`);
//   }
// };


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
  },
  reultLink: {
      display: 'none',
      paddingTop: '3%',
  },
  progress: {
    display: 'none',
    paddingTop: '1%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Album() {
  const classes = useStyles();
  
  const history = useHistory();
  //const tileData = [];

  const[ready, setReady] = useState(false);
  const[progress, setProgress] = useState(0);
  const[video, setVideo] = useState();
  const[subtitle, setSubtitle] = useState([]);
  const[keyframe, setKeyframe] = useState([]);
  const[timestamp, setTimestamp] = useState([]);
  //const[tileData, setTileData] = useState([]);
  const[metadata, setMetadata] = useState();
  const[send, setSend] = useState(false);

  const cards = [

    {
      heading: "Video",
      desc: "Upload your video file here",
      index: 0,
      action: (e) => setVideo(e.target.files?.item(0))
    },
    {
      heading: "Subtitle",
      desc: "Upload your subtitle file here",
      index: 1,
      action: (e) => setSubtitle(e.target.files?.item(0))
    },
  
  ];

  const load = async() => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  //   const timer = setInterval(() => {
  //     setProgress(oldProgress => {
  //       if (oldProgress === 100) {
  //         clearInterval(timer);
  //       }
  //       return Math.min(oldProgress + 0.5, 100);
  //     });
  //   }, 500);
  // return () => {
  //     clearInterval(timer);
  //   };
  }, [])


  const convertToKeyframe = async () => {
    // Write the video file to memory 
    ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));

    // Read in the subtitle file to memory 
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      var srt = parseSRT(text)
      console.log(srt)
      console.log(srt.text)
      var arr = [];
      var arr4 = [];
      for (var i=0; i<srt.length; i++) {
        //setSubtitle([srt[0].text, srt[1].text, srt[2].text, srt[3].text, srt[4].text, srt[5].text, srt[6].text, srt[7].text])
        arr.push(srt[i].text)
        arr4.push(srt[i].start)
        console.log(arr4)
      } 
      setSubtitle(arr);
      setTimestamp(arr4);
      console.log(subtitle[4])
      console.log(timestamp[4])
    };
    reader.readAsText(subtitle)

    //FFmpeg code was adapted from: https://superuser.com/questions/669716/how-to-extract-all-key-frames-from-a-video-clip
    await ffmpeg.run('-i', 'video.mp4', '-force_key_frames', 'expr:gte(t,n_forced*2)', '-preset', 'ultrafast', 'video1.mp4');
    await ffmpeg.run('-skip_frame', 'nokey', '-i', 'video1.mp4', '-vsync', '0', '-r', '30', '-f', 'image2', 'thumbnails-%02d.jpeg');

    console.log("MSGARR::" + msgArr)

    // Read the result
    console.log("THUMBNAIL::" + 'thumbnails-0' + i + '.jpeg');
    const data = [];
    for (var i=1; i<9; i++) {
        //const data = [ffmpeg.FS('readFile', 'thumbnails-01.jpeg'), ffmpeg.FS('readFile', 'thumbnails-02.jpeg'), ffmpeg.FS('readFile', 'thumbnails-03.jpeg'), ffmpeg.FS('readFile', 'thumbnails-04.jpeg'), ffmpeg.FS('readFile', 'thumbnails-05.jpeg'), ffmpeg.FS('readFile', 'thumbnails-06.jpeg'), ffmpeg.FS('readFile', 'thumbnails-07.jpeg'), ffmpeg.FS('readFile', 'thumbnails-08.jpeg'), ffmpeg.FS('readFile', 'thumbnails-09.jpeg')];
        data.push(ffmpeg.FS('readFile', 'thumbnails-0' + i + '.jpeg'));
    }
    for (var i=10; i<msgArr; i++) {
      //const data = [ffmpeg.FS('readFile', 'thumbnails-01.jpeg'), ffmpeg.FS('readFile', 'thumbnails-02.jpeg'), ffmpeg.FS('readFile', 'thumbnails-03.jpeg'), ffmpeg.FS('readFile', 'thumbnails-04.jpeg'), ffmpeg.FS('readFile', 'thumbnails-05.jpeg'), ffmpeg.FS('readFile', 'thumbnails-06.jpeg'), ffmpeg.FS('readFile', 'thumbnails-07.jpeg'), ffmpeg.FS('readFile', 'thumbnails-08.jpeg'), ffmpeg.FS('readFile', 'thumbnails-09.jpeg')];
      data.push(ffmpeg.FS('readFile', 'thumbnails-' + i + '.jpeg'));
  }
    console.log("DATA::" + data[2].buffer);
    //const arr2 = [];
    const url = [];
    for (var i=0; i<data.length; i++) {
        //const url = [URL.createObjectURL(new Blob([data[0].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[1].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[2].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[3].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[4].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[5].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[6].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[7].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[8].buffer], { type: 'image' })),];
        //arr.push(data[i].buffer)
        url.push(URL.createObjectURL(new Blob([data[i].buffer])))
    }
    //const url = URL.createObjectURL(new Blob([arr]));
    console.log("URL::" + url[2]);  
    const arr2 = [];
    // Create a URL
    for (var i=0; i<data.length; i++) {
        //setKeyframe([url[0], url[1], url[2], url[3], url[4], url[5], url[6], url[7], url[8]]);
        arr2.push(url[i])
    }
    setKeyframe(arr2);
    console.log("SUB11:" + subtitle[5])

    console.log("WOOOOOO" + msgArr);


    setSend(true);
       
  }

  const call = async() => {

      // document.getElementById('progress').style.display = 'block';
      await convertToKeyframe();
      document.getElementById('resultLink').style.display = 'block';
  }

  

  return ready ? (

    <div className="App">
      {/* { video && <video
        controls
        width="250"
        src={URL.createObjectURL(video)}>

      </video>} */}

      <React.Fragment>
        <main>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={10}>
              {cards.map((card) => (
                <Grid item key={card} xs={12} sm={12} md={6}>
                  <Card className={classes.card}>
                    <ButtonBase className={classes.image} type="file" variant="contained" component="label">
                      <img className={classes.img} alt="complex" src={uploadImage} />
                      {/* {video && <video controls width="250" src={URL.createObjectURL(video)}></video>} */}
                      <input type="file" hidden onChange={card.action}/>
                    </ButtonBase>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.heading}
                      </Typography>
                      <Typography>
                        {card.desc}
                        {/* {subtitle} */}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <div className={classes.button}>
              <Box textAlign='center'>
              <Button variant="contained" color="primary" style={{justifyContent: 'center'}} onClick={call} >
                    Convert
                </Button>
                <Link id="resultLink" className={classes.reultLink} to={{ pathname:"/result", state: {keyframe: keyframe, subtitle: subtitle, timestamp: timestamp}}}>
                    <Button variant="contained" color="primary" style={{justifyContent: 'center'}}>
                        Ready
                    </Button>
                </Link>
              </Box>
            </div>
            {/* <LinearProgress id="progress" className={classes.progress} variant="determinate" value={progress} /> */}
            {/* <div className={classes.root}>
              <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                  <ListSubheader component="div">Graphic Novel</ListSubheader>
                </GridListTile>
                {tileData.map((tile) => (
                  <GridListTile key={tile.img}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                      subtitle={tile.text}
                    />
                  </GridListTile>
                ))}
              </GridList>
            </div> */}
          </Container>
        </main>
      </React.Fragment>
    </div>
  )
    :
    (
      <p>Loading...</p>
    );
}