import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ButtonBase from '@material-ui/core/ButtonBase';
import uploadImage from './assets/upload-3-256.png';
import Box from '@material-ui/core/Box';
import parseSRT from 'parse-srt';
import {Link} from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: true});

const msgArr = [];

//Get number of subtitles from ffmpeg log
ffmpeg.setLogger(({ type, message }) => {
    console.log("MESSAGE:::" + message);
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


const useStyles = makeStyles((theme) => ({
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
  cardContent: {
    flexGrow: 1,
  },
  image: {
    paddingTop: '5%',
  },
  button: {
    paddingTop: '3%',
    paddingBottom: '3%'
  },
  resultLink: {
      display: 'none',
      paddingTop: '3%',
  },
  progress: {
    display: 'none',
    paddingTop: '1%',
  },
}));

export default function Album() {
  const classes = useStyles();

  //set state variables
  const[ready, setReady] = useState(false);
  const[progress, setProgress] = useState(0);
  const[video, setVideo] = useState();
  const[subtitle, setSubtitle] = useState([]);
  const[keyframe, setKeyframe] = useState([]);
  const[timestamp, setTimestamp] = useState([]);

  const cards = [
    {
      heading: "Video",
      desc: "Upload your video file here",
      index: 0,
      action: (e) => setVideo(e.target.files?.item(0)) //set video file
    },
    {
      heading: "Subtitle",
      desc: "Upload your subtitle file here",
      index: 1,
      action: (e) => setSubtitle(e.target.files?.item(0)) //set subtitle file
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
      var srt = parseSRT(text) //function to parse SRT files
      var subtitleArr = [];
      var timestampArr = [];
      for (var i=0; i<srt.length; i++) {
        subtitleArr.push(srt[i].text) //array of subtitle text
        timestampArr.push(srt[i].start) //array of timestamp data
      } 
      setSubtitle(subtitleArr);
      setTimestamp(timestampArr);
    };
    reader.readAsText(subtitle)

    //FFmpeg code was adapted from: https://superuser.com/questions/669716/how-to-extract-all-key-frames-from-a-video-clip
    //force keyframes every 2 seconds
    await ffmpeg.run('-i', 'video.mp4', '-force_key_frames', 'expr:gte(t,n_forced*2)', '-preset', 'ultrafast', 'video1.mp4');
    //pull and save keyframes from video 
    await ffmpeg.run('-skip_frame', 'nokey', '-i', 'video1.mp4', '-vsync', '0', '-r', '30', '-f', 'image2', 'thumbnails-%02d.jpeg');

    //read the result
    const data = [];
    for (var i=1; i<9; i++) {
        data.push(ffmpeg.FS('readFile', 'thumbnails-0' + i + '.jpeg'));
    }
    for (var i=10; i<msgArr; i++) {
      data.push(ffmpeg.FS('readFile', 'thumbnails-' + i + '.jpeg'));
    }
    
    //create a URL
    const url = [];
    for (var i=0; i<data.length; i++) {
        url.push(URL.createObjectURL(new Blob([data[i].buffer])))
    }
    const keyframeArr = [];
    for (var i=0; i<data.length; i++) {
        keyframeArr.push(url[i])
    }
    setKeyframe(keyframeArr);
    console.log("MSGARR" + msgArr);
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
                <Link id="resultLink" className={classes.resultLink} to={{ pathname:"/result", state: {keyframe: keyframe, subtitle: subtitle, timestamp: timestamp}}}>
                    <Button variant="contained" color="primary" style={{justifyContent: 'center'}}>
                        Ready
                    </Button>
                </Link>
              </Box>
            </div>
            {/* <LinearProgress id="progress" className={classes.progress} variant="determinate" value={progress} /> */}
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