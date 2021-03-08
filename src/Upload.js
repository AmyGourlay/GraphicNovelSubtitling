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
import {useHistory} from 'react-router-dom';
import {Redirect} from 'react-router-dom';

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
        var frame = message.substring(
            message.lastIndexOf("frame"), 
            message.lastIndexOf("fps")
        );
        var timestamp = message.substring(
            message.lastIndexOf("time"), 
            message.lastIndexOf("bitrate")
        );
        msgArr.push(frame);
        msgArr.push(timestamp);
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
  }
}));

export default function Album() {
  const classes = useStyles();
  
  const history = useHistory();
  //const tileData = [];

  const[ready, setReady] = useState(false);
  const[video, setVideo] = useState();
  const[subtitle, setSubtitle] = useState([]);
  const[keyframe, setKeyframe] = useState([]);
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

  const tileData = [

    {
      img: keyframe[0],
      text: subtitle[0]
    },
    {
      img: keyframe[1],
      text: subtitle[1]
    },
    {
      img: keyframe[2],
      text: subtitle[2]
    },
    {
      img: keyframe[3],
      text: subtitle[3]
    },
    {
      img: keyframe[4],
      text: subtitle[4]
    },
    {
      img: keyframe[5],
      text: subtitle[5]
    },
    {
      img: keyframe[6],
      text: subtitle[6]
    },
    {
      img: keyframe[7],
      text: subtitle[7]
    },
  
  ];

    

  const load = async() => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
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
      for (var i=0; i<srt.length; i++) {
        //setSubtitle([srt[0].text, srt[1].text, srt[2].text, srt[3].text, srt[4].text, srt[5].text, srt[6].text, srt[7].text])
        arr.push(srt[i].text)
      } 
      setSubtitle(arr);
      console.log(subtitle[4])
    };
    reader.readAsText(subtitle)

    //await ffmpeg.run('-i', 'test.mp4', '-i', 'infile.srt', '-c', 'copy', '-c:s', 'mov_text', 'outfile.mp4');
    // Run the FFMpeg command
    //await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'keyframe', 'out.keyframe');
    //code taken from: https://superuser.com/questions/669716/how-to-extract-all-key-frames-from-a-video-clip
    await ffmpeg.run('-skip_frame', 'nokey', '-i', 'video.mp4', '-vsync', '0', '-r', '30', '-f', 'image2', 'thumbnails-%02d.jpeg');
    //await ffmpeg.run('-i', 'video.mp4', '-vf', 'select=eq(pict_type\,I)', '-vsync', 'vfr', 'frame-%02d.png');
    //await ffmpeg.run('-i', 'video.mp4', 'out.txt', '-loglevel', 'debug', '-v', 'verbose');
    //await ffmpeg.run('-skip_frame', 'nokey', '-i', 'video.mp4', '-vsync', '0', '-r', '30', '-f', 'image2', '-strftime', '1', '%Y-%m-%d_%H-%M-%S.jpg');
    //await ffmpeg.run('-i', 'video.mp4', '-f', 'ffmetadata', 'in.txt');
    //await ffprobe.run('-loglevel', 'error', '-skip_frame', 'nokey', '-select_streams', 'v:0', '-show_entries', 'frame=pkt_pts_time', '-of', 'csv=print_section=0', 'input.mp4')
    //await ffmpeg.run('-i', 'video.mp4', '-vf', 'select=key', '-an', '-vsync', '0', 'keyframes%03d.jpeg', '-loglevel', 'debug', '2>&1', '|', 'findstr', 'select:1', '>', 'keyframes.txt');


    //const meta = [ffmpeg.FS('readFile', 'in.txt')];
    //console.log(meta);

    // const reader2 = new FileReader()
    // reader2.onload = async (e) => { 
    //   const text = (e.target.result)
    //   console.log(text)
    //  };
    // reader2.readAsText('in.txt')

    // Read the result
    console.log();
    const data = [ffmpeg.FS('readFile', 'thumbnails-01.jpeg'), ffmpeg.FS('readFile', 'thumbnails-02.jpeg'), ffmpeg.FS('readFile', 'thumbnails-03.jpeg'), ffmpeg.FS('readFile', 'thumbnails-04.jpeg'), ffmpeg.FS('readFile', 'thumbnails-05.jpeg'), ffmpeg.FS('readFile', 'thumbnails-06.jpeg'), ffmpeg.FS('readFile', 'thumbnails-07.jpeg'), ffmpeg.FS('readFile', 'thumbnails-08.jpeg'), ffmpeg.FS('readFile', 'thumbnails-09.jpeg'),];
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

    // <Link to={{ pathname:"/result", state: tileData}}>
    //     Link
    // </Link>

    // var arr3 = [];
    // for (var i=0; i<keyframe.length; i++) {
    //     arr3.push([
    //     {
    //     img: keyframe[i],
    //     text: subtitle[i]
    //     },
    // ]);
    // }
    // setTileData(arr3)
    
    //console.log("HERE!!!!!!!!!!!" + ffLog.log());

    console.log("WOOOOOO" + msgArr);


    setSend(true);
       
  }

   

  const redirect = () => {
    
    console.log("SUB:" + subtitle[5]);
    console.log("DATA:::" + tileData);

    //history.push({ pathname:"/result", state: tileData});

    return <Redirect 
        to={{
            pathname: "/result",
            state: tileData
        }}
    />
  }

  const call = async() => {
      await convertToKeyframe();
      //redirect();
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
                <Link id="resultLink" className={classes.reultLink} to={{ pathname:"/result", state: tileData}}>
                    <Button variant="contained" color="primary" style={{justifyContent: 'center'}}>
                        Ready
                    </Button>
                </Link>
              </Box>
            </div>
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